from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib import messages
from django.contrib.auth.models import User
from django.http import JsonResponse, HttpResponseRedirect
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import uuid
from .models import (
    ContactSubmission, InquiryCategory, Subscriber, SubscriptionCategory, Newsletter, 
    JobPosting, JobCategory, JobApplication, NewsArticle, BlogCategory,
    Achievement, AchievementCategory, ProjectPortfolio, CompanyMilestone
)
import json
from django.core.serializers.json import DjangoJSONEncoder
from django.core.paginator import Paginator
from django.utils import timezone
from datetime import datetime

def index(request):
    # Get the latest 6 active job postings for the homepage
    job_postings = JobPosting.objects.filter(status='ACTIVE').order_by('-posted_date')[:6]
    
    # Process requirements and animation delay for each job posting
    for index, job in enumerate(job_postings):
        requirements_list = []
        if job.requirements:
            # Split requirements and clean up for display
            raw_requirements = job.requirements.replace('\n', '|').replace(',', '|').replace(';', '|')
            requirements_list = [req.strip() for req in raw_requirements.split('|') if req.strip()]
            # Limit to first 4 requirements for homepage display
            requirements_list = requirements_list[:4]
        job.requirements_list = requirements_list
        job.animation_delay = index * 0.1  # For staggered animation
    
    context = {
        'job_postings': job_postings,
        'has_jobs': job_postings.exists()
    }
    return render(request, 'axflo_app/index.html', context)

def about(request):
    return render(request, 'axflo_app/about.html')

def services(request):
    return render(request, 'axflo_app/services.html')

def media(request):
    """Public media/blog page with pagination"""
    from django.core.paginator import Paginator
    from django.db.models import Q
    
    # Get published articles only
    articles = NewsArticle.objects.filter(status='PUBLISHED').order_by('-published_at')
    
    # Search functionality
    search_query = request.GET.get('search', '')
    if search_query:
        articles = articles.filter(
            Q(title__icontains=search_query) |
            Q(excerpt__icontains=search_query) |
            Q(tags__icontains=search_query)
        )
    
    # Category filter
    category_filter = request.GET.get('category', '')
    if category_filter:
        articles = articles.filter(category__slug=category_filter)
    
    # Pagination - 5 posts per page as requested
    paginator = Paginator(articles, 5)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    # Get categories for filter
    categories = BlogCategory.objects.all()
    
    # Get featured articles for sidebar
    featured_articles = NewsArticle.objects.filter(
        status='PUBLISHED', 
        featured=True
    ).order_by('-published_at')[:3]
    
    context = {
        'articles': page_obj,
        'categories': categories,
        'featured_articles': featured_articles,
        'search_query': search_query,
        'category_filter': category_filter,
        'has_articles': articles.exists(),
    }
    
    return render(request, 'axflo_app/media.html', context)

def blog_detail(request, slug):
    """Blog detail page view"""
    try:
        article = NewsArticle.objects.get(slug=slug, status='PUBLISHED')
        
        # Increment view count
        article.view_count += 1
        article.save(update_fields=['view_count'])
        
        # Get related articles (same category, excluding current)
        related_articles = NewsArticle.objects.filter(
            category=article.category,
            status='PUBLISHED'
        ).exclude(id=article.id)[:3]
        
        # Get recent articles for sidebar
        recent_articles = NewsArticle.objects.filter(
            status='PUBLISHED'
        ).exclude(id=article.id).order_by('-published_at')[:5]
        
        # Get all categories for sidebar
        categories = BlogCategory.objects.all()
        
        context = {
            'article': article,
            'related_articles': related_articles,
            'recent_articles': recent_articles,
            'categories': categories,
        }
        
        return render(request, 'axflo_app/blog_detail.html', context)
        
    except NewsArticle.DoesNotExist:
        from django.http import Http404
        raise Http404("Blog post not found")

def csr(request):
    return render(request, 'axflo_app/csr.html')

def careers(request):
    # Get active job postings
    job_postings = JobPosting.objects.filter(status='ACTIVE').order_by('-posted_date')
    
    # Process requirements for each job posting
    for job in job_postings:
        # Split requirements into a list for template display
        requirements_list = []
        if job.requirements:
            # Split by common separators and clean up
            raw_requirements = job.requirements.replace('\n', '|').replace(',', '|').replace(';', '|')
            requirements_list = [req.strip() for req in raw_requirements.split('|') if req.strip()]
            # Limit to first 4 requirements for display
            requirements_list = requirements_list[:4]
        job.requirements_list = requirements_list
    
    context = {
        'job_postings': job_postings,
        'has_jobs': job_postings.exists()
    }
    return render(request, 'axflo_app/careers.html', context)

def achievements(request):
    """Achievements and Portfolio page with dynamic content"""
    from django.db.models import Count, Q
    
    # Get featured achievements
    featured_achievements = Achievement.objects.filter(
        status='ACTIVE', 
        featured=True
    ).select_related('category').order_by('display_order', '-achievement_date')[:3]
    
    # Get all active achievements
    achievements = Achievement.objects.filter(
        status='ACTIVE'
    ).select_related('category').order_by('-achievement_date', 'display_order')
    
    # Get portfolio projects
    portfolio_projects = ProjectPortfolio.objects.filter(
        status__in=['FEATURED', 'STANDARD']
    ).order_by('-completion_date', 'display_order')
    
    # Get milestones
    milestones = CompanyMilestone.objects.all().order_by('-milestone_date', 'display_order')
    featured_milestones = milestones.filter(featured=True)[:5]
    
    # Calculate statistics
    total_achievements = achievements.count()
    completed_projects = portfolio_projects.filter(status='STANDARD').count() + portfolio_projects.filter(status='FEATURED').count()
    
    # Calculate environmental impact (sum from achievements and projects)
    environmental_impact = 0
    for achievement in achievements:
        if achievement.impact_metrics and 'co2_reduced' in achievement.impact_metrics:
            try:
                environmental_impact += int(achievement.impact_metrics['co2_reduced'])
            except (ValueError, TypeError):
                pass
    
    for project in portfolio_projects:
        if project.environmental_impact and 'co2_prevented' in project.environmental_impact:
            try:
                environmental_impact += int(project.environmental_impact['co2_prevented'])
            except (ValueError, TypeError):
                pass
    
    # Countries served (can be dynamic or from settings)
    countries_served = 15  # This could be calculated from project locations
    
    # Convert data to JSON for JavaScript
    achievements_json = json.dumps([{
        'id': achievement.id,
        'title': achievement.title,
        'description': achievement.description,
        'short_description': achievement.short_description,
        'achievement_type': achievement.achievement_type,
        'category': {
            'name': achievement.category.name,
            'color': achievement.category.color,
            'icon': achievement.category.icon
        },
        'achievement_date': achievement.achievement_date.isoformat(),
        'featured_image': achievement.featured_image.url if achievement.featured_image else None,
        'impact_metrics': achievement.impact_metrics,
        'external_link': achievement.external_link,
        'featured': achievement.featured
    } for achievement in achievements], cls=DjangoJSONEncoder)
    
    portfolio_json = json.dumps([{
        'id': project.id,
        'title': project.title,
        'client': project.client,
        'location': project.location,
        'project_type': project.project_type,
        'brief_description': project.brief_description,
        'completion_date': project.completion_date.isoformat() if project.completion_date else None,
        'featured_image': project.featured_image.url if project.featured_image else None,
        'key_statistics': project.key_statistics,
        'status': project.status,
        'duration_months': project.duration_months
    } for project in portfolio_projects], cls=DjangoJSONEncoder)
    
    milestones_json = json.dumps([{
        'id': milestone.id,
        'title': milestone.title,
        'description': milestone.description,
        'milestone_date': milestone.milestone_date.isoformat(),
        'milestone_year': milestone.milestone_year,
        'icon': milestone.icon,
        'featured': milestone.featured
    } for milestone in milestones], cls=DjangoJSONEncoder)
    
    context = {
        'featured_achievements': featured_achievements,
        'achievements': achievements,
        'portfolio_projects': portfolio_projects,
        'milestones': milestones,
        'featured_milestones': featured_milestones,
        'total_achievements': total_achievements,
        'completed_projects': completed_projects,
        'environmental_impact': environmental_impact,
        'countries_served': countries_served,
        'achievements_json': achievements_json,
        'portfolio_json': portfolio_json,
        'milestones_json': milestones_json,
    }
    
    return render(request, 'axflo_app/achievements.html', context)

# Service Pages
def construction_services(request):
    return render(request, 'axflo_app/construction-services.html')

def engineering_consultancy(request):
    return render(request, 'axflo_app/engineering-consultancy.html')

def environmental_services(request):
    return render(request, 'axflo_app/environmental-services.html')

def environmental_technologies(request):
    return render(request, 'axflo_app/environmental-technologies.html')

def equipment_hire_services(request):
    return render(request, 'axflo_app/equipment-hire-services.html')

def incident_management(request):
    return render(request, 'axflo_app/incident-management.html')

def installation_services(request):
    return render(request, 'axflo_app/installation-services.html')

def marine_support_services(request):
    return render(request, 'axflo_app/marine-support-services.html')

def offshore_accommodation_services(request):
    return render(request, 'axflo_app/offshore-accommodation-services.html')

def offshore_marine_services(request):
    return render(request, 'axflo_app/offshore-marine-services.html')

def oil_spill_response(request):
    return render(request, 'axflo_app/oil-spill-response.html')

def plant_operation_facility_management(request):
    return render(request, 'axflo_app/plant-operation-facility-management.html')

def preparedness_planning(request):
    return render(request, 'axflo_app/preparedness-planning.html')

def procurement_logistics(request):
    return render(request, 'axflo_app/procurement-logistics.html')

def project_management(request):
    return render(request, 'axflo_app/project-management.html')

def renewable_energy(request):
    return render(request, 'axflo_app/renewable-energy.html')

def testing_commissioning(request):
    return render(request, 'axflo_app/testing-commissioning.html')

def testing(request):
    return render(request, 'axflo_app/testing.html')

def training_programs(request):
    return render(request, 'axflo_app/training-programs.html')

def waste_recycling(request):
    return render(request, 'axflo_app/waste-recycling.html')

def water_wastewater_treatment(request):
    return render(request, 'axflo_app/water-wastewater-treatment.html')

def qshe(request):
    return render(request, 'axflo_app/qshe.html')

# Admin Dashboard Functionality
def is_staff_or_admin(user):
    return user.is_staff or user.is_superuser

def admin_login(request):
    from django.http import HttpResponseRedirect, HttpResponse
    
    try:
        # If user is already authenticated and has permissions, redirect to dashboard
        if request.user.is_authenticated and (request.user.is_staff or request.user.is_superuser):
            return HttpResponseRedirect('/admindashboard/')
        
        if request.method == 'POST':
            username = request.POST.get('username', '').strip()
            password = request.POST.get('password', '').strip()
            
            if not username or not password:
                messages.error(request, 'Please provide both username and password')
                return render(request, 'axflo_app/admin/login.html')
            
            # Authenticate user
            user = authenticate(request, username=username, password=password)
            
            if user is not None:
                if user.is_staff or user.is_superuser:
                    login(request, user)
                    return HttpResponseRedirect('/admindashboard/')
                else:
                    messages.error(request, 'You do not have permission to access the admin dashboard')
            else:
                messages.error(request, 'Invalid username or password')
        
        return render(request, 'axflo_app/admin/login.html')
    
    except Exception as e:
        # Debug: return the error as a response
        return HttpResponse(f"Error in admin_login: {str(e)}", status=500)

def admin_register(request):
    from django.http import HttpResponseRedirect, HttpResponse
    
    try:
        if request.method == 'POST':
            username = request.POST.get('username', '').strip()
            email = request.POST.get('email', '').strip()
            password = request.POST.get('password', '').strip()
            password_confirm = request.POST.get('password_confirm', '').strip()
            
            # Validation
            if not all([username, email, password, password_confirm]):
                messages.error(request, 'All fields are required')
                return render(request, 'axflo_app/admin/register.html')
            
            if password != password_confirm:
                messages.error(request, 'Passwords do not match')
                return render(request, 'axflo_app/admin/register.html')
            
            if len(password) < 8:
                messages.error(request, 'Password must be at least 8 characters long')
                return render(request, 'axflo_app/admin/register.html')
            
            # Check if username already exists
            if User.objects.filter(username=username).exists():
                messages.error(request, 'Username already exists')
                return render(request, 'axflo_app/admin/register.html')
            
            # Check if email already exists
            if User.objects.filter(email=email).exists():
                messages.error(request, 'Email already exists')
                return render(request, 'axflo_app/admin/register.html')
            
            # Create the admin user
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password
            )
            user.is_staff = True
            user.is_superuser = True
            user.save()
            
            messages.success(request, 'Admin account created successfully! You can now login.')
            return HttpResponseRedirect('/admin-login/')
        
        return render(request, 'axflo_app/admin/register.html')
    
    except Exception as e:
        return HttpResponse(f"Error in admin_register: {str(e)}", status=500)

def admindashboard(request):
    from django.http import HttpResponseRedirect
    
    # Manual authentication check - no decorators
    if not request.user.is_authenticated:
        return HttpResponseRedirect('/admin-login/')
    
    if not (request.user.is_staff or request.user.is_superuser):
        return HttpResponseRedirect('/admin-login/')
    
    # Get some basic stats for the dashboard
    context = {
        'total_users': User.objects.count(),
        'staff_users': User.objects.filter(is_staff=True).count(),
        'superusers': User.objects.filter(is_superuser=True).count(),
        'total_contacts': ContactSubmission.objects.count(),
        'unread_contacts': ContactSubmission.objects.filter(read=False).count(),
        'recent_contacts': ContactSubmission.objects.order_by('-date')[:5],
        'total_subscribers': Subscriber.objects.count(),
        'active_subscribers': Subscriber.objects.filter(active_status=True).count(),
        'total_newsletters': Newsletter.objects.count(),
        'recent_subscribers': Subscriber.objects.order_by('-subscription_date')[:5],
        'total_articles': NewsArticle.objects.count(),
        'published_articles': NewsArticle.objects.filter(status='PUBLISHED').count(),
        'recent_articles': NewsArticle.objects.order_by('-created_at')[:5],
        'total_jobs': Job.objects.count() if 'Job' in globals() else 0,
    }
    return render(request, 'axflo_app/admin/dashboard.html', context)

def admin_users(request):
    from django.http import HttpResponseRedirect
    
    # Manual authentication check - no decorators
    if not request.user.is_authenticated:
        return HttpResponseRedirect('/admin-login/')
    
    if not (request.user.is_staff or request.user.is_superuser):
        return HttpResponseRedirect('/admin-login/')
    
    users = User.objects.all().order_by('-date_joined')
    return render(request, 'axflo_app/admin/users.html', {'users': users})

def admin_logout(request):
    from django.http import HttpResponseRedirect
    
    # Manual authentication check - no decorators
    if not request.user.is_authenticated:
        return HttpResponseRedirect('/admin-login/')
    
    if not (request.user.is_staff or request.user.is_superuser):
        return HttpResponseRedirect('/admin-login/')
    
    logout(request)
    messages.success(request, 'You have been logged out successfully')
    return HttpResponseRedirect('/admin-login/')

def contact(request):
    if request.method == 'POST':
        try:
            # Get form data
            name = request.POST.get('name', '').strip()
            email = request.POST.get('email', '').strip()
            company = request.POST.get('company', '').strip()
            phone = request.POST.get('phone', '').strip()
            inquiry_type_id = request.POST.get('inquiry_type')
            message = request.POST.get('message', '').strip()
            
            # Validate required fields
            if not name or not email or not message or not inquiry_type_id:
                return JsonResponse({
                    'success': False, 
                    'message': 'Please fill in all required fields.'
                })
            
            # Get inquiry category
            try:
                inquiry_category = InquiryCategory.objects.get(id=inquiry_type_id)
            except InquiryCategory.DoesNotExist:
                return JsonResponse({
                    'success': False, 
                    'message': 'Invalid inquiry type selected.'
                })
            
            # Create contact submission
            contact_submission = ContactSubmission.objects.create(
                name=name,
                email=email,
                company=company,
                phone=phone,
                inquiry_type=inquiry_category,
                message=message
            )
            
            return JsonResponse({
                'success': True, 
                'message': 'Thank you for your message! We will get back to you soon.'
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False, 
                'message': 'An error occurred. Please try again later.'
            })
    
    # GET request - display the contact form
    inquiry_categories = InquiryCategory.objects.all()
    context = {
        'inquiry_categories': inquiry_categories
    }
    return render(request, 'axflo_app/contact.html', context)

def admin_contacts(request):
    from django.http import HttpResponseRedirect
    from django.core.paginator import Paginator
    from django.db.models import Q
    
    # Manual authentication check
    if not request.user.is_authenticated:
        return HttpResponseRedirect('/admin-login/')
    
    if not (request.user.is_staff or request.user.is_superuser):
        return HttpResponseRedirect('/admin-login/')
    
    # Get filter parameters
    status_filter = request.GET.get('status', 'all')
    inquiry_type_filter = request.GET.get('inquiry_type', 'all')
    search_query = request.GET.get('search', '')
    
    # Base queryset
    contacts = ContactSubmission.objects.all()
    
    # Apply filters
    if status_filter == 'read':
        contacts = contacts.filter(read=True)
    elif status_filter == 'unread':
        contacts = contacts.filter(read=False)
    
    if inquiry_type_filter != 'all':
        contacts = contacts.filter(inquiry_type_id=inquiry_type_filter)
    
    if search_query:
        contacts = contacts.filter(
            Q(name__icontains=search_query) |
            Q(email__icontains=search_query) |
            Q(company__icontains=search_query) |
            Q(message__icontains=search_query)
        )
    
    # Order by date (newest first)
    contacts = contacts.order_by('-date')
    
    # Pagination
    paginator = Paginator(contacts, 20)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    # Get inquiry categories for filter dropdown
    inquiry_categories = InquiryCategory.objects.all()
    
    context = {
        'contacts': page_obj,
        'inquiry_categories': inquiry_categories,
        'status_filter': status_filter,
        'inquiry_type_filter': inquiry_type_filter,
        'search_query': search_query,
        'total_contacts': ContactSubmission.objects.count(),
        'unread_contacts': ContactSubmission.objects.filter(read=False).count(),
    }
    
    return render(request, 'axflo_app/admin/contacts.html', context)

def admin_contact_detail(request, contact_id):
    from django.http import HttpResponseRedirect, Http404
    from django.shortcuts import get_object_or_404
    
    # Manual authentication check
    if not request.user.is_authenticated:
        return HttpResponseRedirect('/admin-login/')
    
    if not (request.user.is_staff or request.user.is_superuser):
        return HttpResponseRedirect('/admin-login/')
    
    # Get contact submission
    try:
        contact = get_object_or_404(ContactSubmission, id=contact_id)
    except Http404:
        messages.error(request, 'Contact submission not found.')
        return HttpResponseRedirect('/admin-contacts/')
    
    # Mark as read when viewed
    if not contact.read:
        contact.read = True
        contact.save()
    
    # Handle response submission
    if request.method == 'POST':
        response_text = request.POST.get('response_text', '').strip()
        
        if response_text:
            # Import here to avoid circular imports
            from .models import ContactResponse
            
            ContactResponse.objects.create(
                contact_submission=contact,
                response_text=response_text,
                staff_member=request.user
            )
            messages.success(request, 'Response sent successfully!')
            return HttpResponseRedirect(f'/admin-contact/{contact_id}/')
        else:
            messages.error(request, 'Please enter a response.')
    
    # Get existing responses
    responses = contact.contactresponse_set.all().order_by('-response_date')
    
    context = {
        'contact': contact,
        'responses': responses,
    }
    
    return render(request, 'axflo_app/admin/contact_detail.html', context)

def admin_contact_toggle_read(request, contact_id):
    from django.http import HttpResponseRedirect, JsonResponse
    from django.shortcuts import get_object_or_404
    
    # Manual authentication check
    if not request.user.is_authenticated:
        return HttpResponseRedirect('/admin-login/')
    
    if not (request.user.is_staff or request.user.is_superuser):
        return HttpResponseRedirect('/admin-login/')
    
    contact = get_object_or_404(ContactSubmission, id=contact_id)
    contact.read = not contact.read
    contact.save()
    
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return JsonResponse({
            'success': True,
            'read': contact.read
        })
    
    return HttpResponseRedirect('/admin-contacts/')

def admin_contact_delete(request, contact_id):
    from django.http import HttpResponseRedirect, JsonResponse
    from django.shortcuts import get_object_or_404
    from django.contrib import messages
    
    # Manual authentication check
    if not request.user.is_authenticated:
        return HttpResponseRedirect('/admin-login/')
    
    if not (request.user.is_staff or request.user.is_superuser):
        return HttpResponseRedirect('/admin-login/')
    
    contact = get_object_or_404(ContactSubmission, id=contact_id)
    contact_name = contact.name
    contact.delete()
    
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return JsonResponse({
            'success': True,
            'message': f'Contact message from {contact_name} has been deleted successfully.'
        })
    
    messages.success(request, f'Contact message from {contact_name} has been deleted successfully.')
    return HttpResponseRedirect('/admin-contacts/')

def admin_contact_bulk_delete(request):
    from django.http import HttpResponseRedirect, JsonResponse
    from django.contrib import messages
    import json
    
    # Manual authentication check
    if not request.user.is_authenticated:
        return HttpResponseRedirect('/admin-login/')
    
    if not (request.user.is_staff or request.user.is_superuser):
        return HttpResponseRedirect('/admin-login/')
    
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            contact_ids = data.get('contact_ids', [])
            
            if not contact_ids:
                return JsonResponse({
                    'success': False,
                    'message': 'No contacts selected for deletion.'
                })
            
            # Delete selected contacts
            deleted_count = ContactSubmission.objects.filter(id__in=contact_ids).delete()[0]
            
            return JsonResponse({
                'success': True,
                'message': f'Successfully deleted {deleted_count} contact message(s).',
                'deleted_count': deleted_count
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error deleting contacts: {str(e)}'
            })
    
    return JsonResponse({
        'success': False,
        'message': 'Invalid request method.'
    })

def newsletter_subscribe(request):
    """Handle newsletter subscription via AJAX"""
    if request.method == 'POST':
        try:
            email = request.POST.get('email', '').strip().lower()
            first_name = request.POST.get('first_name', '').strip()
            last_name = request.POST.get('last_name', '').strip()
            
            # Validate email
            if not email:
                return JsonResponse({
                    'success': False,
                    'message': 'Please enter your email address.'
                })
            
            try:
                validate_email(email)
            except ValidationError:
                return JsonResponse({
                    'success': False,
                    'message': 'Please enter a valid email address.'
                })
            
            # Check if subscriber already exists
            if Subscriber.objects.filter(email=email).exists():
                return JsonResponse({
                    'success': False,
                    'message': 'This email is already subscribed to our newsletter.'
                })
            
            # Create new subscriber
            subscriber = Subscriber.objects.create(
                email=email,
                first_name=first_name,
                last_name=last_name,
                unsubscribe_token=str(uuid.uuid4())
            )
            
            return JsonResponse({
                'success': True,
                'message': 'Thank you for subscribing! You will receive our latest updates and news.'
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'An error occurred. Please try again later.'
            })
    
    return JsonResponse({
        'success': False,
        'message': 'Invalid request method.'
    })

def newsletter_unsubscribe(request, token):
    """Handle newsletter unsubscription via unique token"""
    try:
        subscriber = Subscriber.objects.get(unsubscribe_token=token)
        subscriber.active_status = False
        subscriber.save()
        
        context = {
            'success': True,
            'message': 'You have been successfully unsubscribed from our newsletter.',
            'email': subscriber.email
        }
        return render(request, 'axflo_app/newsletter_unsubscribe.html', context)
        
    except Subscriber.DoesNotExist:
        context = {
            'success': False,
            'message': 'Invalid unsubscribe link. Please contact us if you need assistance.',
            'email': None
        }
        return render(request, 'axflo_app/newsletter_unsubscribe.html', context)

def admin_subscribers(request):
    """Custom admin view for managing newsletter subscribers"""
    from django.http import HttpResponseRedirect
    from django.core.paginator import Paginator
    from django.db.models import Q
    
    # Manual authentication check
    if not request.user.is_authenticated:
        return HttpResponseRedirect('/admin-login/')
    
    if not (request.user.is_staff or request.user.is_superuser):
        return HttpResponseRedirect('/admin-login/')
    
    # Get filter parameters
    status_filter = request.GET.get('status', 'all')
    search_query = request.GET.get('search', '')
    
    # Base queryset
    subscribers = Subscriber.objects.all()
    
    # Apply filters
    if status_filter == 'active':
        subscribers = subscribers.filter(active_status=True)
    elif status_filter == 'inactive':
        subscribers = subscribers.filter(active_status=False)
    
    if search_query:
        subscribers = subscribers.filter(
            Q(email__icontains=search_query) |
            Q(first_name__icontains=search_query) |
            Q(last_name__icontains=search_query)
        )
    
    # Order by subscription date (newest first)
    subscribers = subscribers.order_by('-subscription_date')
    
    # Pagination
    paginator = Paginator(subscribers, 20)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    # Get subscription categories for context
    subscription_categories = SubscriptionCategory.objects.all()
    
    context = {
        'subscribers': page_obj,
        'subscription_categories': subscription_categories,
        'status_filter': status_filter,
        'search_query': search_query,
        'total_subscribers': Subscriber.objects.count(),
        'active_subscribers': Subscriber.objects.filter(active_status=True).count(),
        'inactive_subscribers': Subscriber.objects.filter(active_status=False).count(),
    }
    
    return render(request, 'axflo_app/admin/subscribers.html', context)

def admin_newsletters(request):
    """Custom admin view for managing newsletters"""
    from django.http import HttpResponseRedirect
    from django.core.paginator import Paginator
    from django.db.models import Q
    
    # Manual authentication check
    if not request.user.is_authenticated:
        return HttpResponseRedirect('/admin-login/')
    
    if not (request.user.is_staff or request.user.is_superuser):
        return HttpResponseRedirect('/admin-login/')
    
    # Get filter parameters
    status_filter = request.GET.get('status', 'all')
    search_query = request.GET.get('search', '')
    
    # Base queryset
    newsletters = Newsletter.objects.all()
    
    # Apply filters
    if status_filter == 'sent':
        newsletters = newsletters.filter(sent=True)
    elif status_filter == 'draft':
        newsletters = newsletters.filter(sent=False)
    
    if search_query:
        newsletters = newsletters.filter(
            Q(title__icontains=search_query) |
            Q(content__icontains=search_query)
        )
    
    # Order by created date (newest first)
    newsletters = newsletters.order_by('-created_date')
    
    # Pagination
    paginator = Paginator(newsletters, 15)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    context = {
        'newsletters': page_obj,
        'status_filter': status_filter,
        'search_query': search_query,
        'total_newsletters': Newsletter.objects.count(),
        'sent_newsletters': Newsletter.objects.filter(sent=True).count(),
        'draft_newsletters': Newsletter.objects.filter(sent=False).count(),
    }
    
    return render(request, 'axflo_app/admin/newsletters.html', context)

def admin_newsletter_categories(request):
    """Custom admin view for managing newsletter categories"""
    try:
        # Check if user is authenticated and has staff permissions
        if not request.user.is_authenticated:
            return HttpResponseRedirect('/admin-login/')
        
        if not request.user.is_staff:
            return HttpResponseRedirect('/admin-login/')
        
        # Handle POST request for creating/updating categories
        if request.method == 'POST':
            name = request.POST.get('name', '').strip()
            description = request.POST.get('description', '').strip()
            icon = request.POST.get('icon', 'fas fa-tag')
            color = request.POST.get('color', '#d6a019')
            status = request.POST.get('status', 'active')
            
            # Validation
            if not name:
                messages.error(request, 'Category name is required.')
                return HttpResponseRedirect('/admin-newsletter-categories/')
            
            # Check if category already exists
            if SubscriptionCategory.objects.filter(name=name).exists():
                messages.error(request, f'Category "{name}" already exists.')
                return HttpResponseRedirect('/admin-newsletter-categories/')
            
            try:
                # Create new category
                category = SubscriptionCategory.objects.create(
                    name=name,
                    description=description
                )
                
                messages.success(request, f'Category "{name}" created successfully!')
                return HttpResponseRedirect('/admin-newsletter-categories/')
                
            except Exception as e:
                messages.error(request, f'Error creating category: {str(e)}')
                return HttpResponseRedirect('/admin-newsletter-categories/')
        
        # Handle GET request - display categories
        categories = SubscriptionCategory.objects.all().order_by('name')
        
        # Calculate statistics for each category
        for category in categories:
            category.subscriber_count = category.subscriber_set.filter(active_status=True).count()
            category.newsletter_count = Newsletter.objects.filter(categories=category).count()
        
        # Calculate overall statistics
        total_categories = categories.count()
        active_subscribers = Subscriber.objects.filter(active_status=True).count()
        newsletters_sent = Newsletter.objects.filter(sent=True).count()
        
        # Find most popular category
        most_popular = None
        max_subscribers = 0
        for category in categories:
            if category.subscriber_count > max_subscribers:
                max_subscribers = category.subscriber_count
                most_popular = category.name
        
        context = {
            'categories': categories,
            'total_categories': total_categories,
            'active_subscribers': active_subscribers,
            'newsletters_sent': newsletters_sent,
            'most_popular_category': most_popular or 'None',
            'current_page': 'newsletter_categories'
        }
        
        return render(request, 'axflo_app/admin/admin_newsletter_categories.html', context)
        
    except Exception as e:
        messages.error(request, f'Error loading newsletter categories: {str(e)}')
        return HttpResponseRedirect('/admindashboard/')

def admin_newsletter_create(request):
    """Custom admin view for creating newsletters"""
    try:
        # Check if user is authenticated and has staff permissions
        if not request.user.is_authenticated:
            return HttpResponseRedirect('/admin-login/')
        
        if not request.user.is_staff:
            return HttpResponseRedirect('/admin-login/')
        
        # Handle POST request for creating newsletter
        if request.method == 'POST':
            title = request.POST.get('title', '').strip()
            content = request.POST.get('content', '').strip()
            category_ids = request.POST.getlist('categories')
            template_type = request.POST.get('template', 'basic')
            send_immediately = request.POST.get('send_immediately') == 'on'
            
            # Validation
            if not title:
                messages.error(request, 'Newsletter title is required.')
                return render(request, 'axflo_app/admin/admin_newsletter_create.html', {
                    'categories': SubscriptionCategory.objects.all(),
                    'current_page': 'newsletter_create'
                })
            
            if not content:
                messages.error(request, 'Newsletter content is required.')
                return render(request, 'axflo_app/admin/admin_newsletter_create.html', {
                    'categories': SubscriptionCategory.objects.all(),
                    'current_page': 'newsletter_create'
                })
            
            try:
                # Create newsletter
                newsletter = Newsletter.objects.create(
                    title=title,
                    content=content,
                    sent=send_immediately,
                    send_date=timezone.now() if send_immediately else None,
                    created_date=timezone.now()
                )
                
                # Add categories if selected
                if category_ids:
                    categories = SubscriptionCategory.objects.filter(id__in=category_ids)
                    newsletter.categories.set(categories)
                
                # Calculate recipient count
                if category_ids:
                    recipients = Subscriber.objects.filter(
                        interests__in=category_ids,
                        active_status=True
                    ).distinct()
                else:
                    recipients = Subscriber.objects.filter(active_status=True)
                
                newsletter.recipient_count = recipients.count()
                newsletter.save()
                
                if send_immediately:
                    messages.success(request, f'Newsletter "{title}" created and sent to {newsletter.recipient_count} subscribers!')
                else:
                    messages.success(request, f'Newsletter "{title}" created as draft. Ready to send to {newsletter.recipient_count} subscribers.')
                
                return HttpResponseRedirect('/admin-newsletters/')
                
            except Exception as e:
                messages.error(request, f'Error creating newsletter: {str(e)}')
        
        # Handle GET request - show create form
        categories = SubscriptionCategory.objects.all().order_by('name')
        
        context = {
            'categories': categories,
            'current_page': 'newsletter_create'
        }
        
        return render(request, 'axflo_app/admin/admin_newsletter_create.html', context)
        
    except Exception as e:
        messages.error(request, f'Error loading newsletter creation form: {str(e)}')
        return HttpResponseRedirect('/admin-newsletters/')

def admin_newsletter_delete(request, newsletter_id):
    """Delete newsletter"""
    from django.http import HttpResponseRedirect, JsonResponse
    from django.shortcuts import get_object_or_404
    
    # Manual authentication check
    if not request.user.is_authenticated:
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({'error': 'Authentication required'}, status=401)
        return HttpResponseRedirect('/admin-login/')
    
    if not (request.user.is_staff or request.user.is_superuser):
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({'error': 'Permission denied'}, status=403)
        return HttpResponseRedirect('/admin-login/')
    
    if request.method == 'POST':
        try:
            newsletter = get_object_or_404(Newsletter, id=newsletter_id)
            newsletter_title = newsletter.title
            
            # Check if newsletter has been sent
            if newsletter.sent:
                if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                    return JsonResponse({
                        'success': False,
                        'message': 'Cannot delete a newsletter that has already been sent.'
                    })
                else:
                    messages.error(request, 'Cannot delete a newsletter that has already been sent.')
                    return HttpResponseRedirect('/admin-newsletters/')
            
            # Delete the newsletter
            newsletter.delete()
            
            message = f'Newsletter "{newsletter_title}" has been deleted successfully.'
            
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({
                    'success': True,
                    'message': message
                })
            else:
                messages.success(request, message)
                return HttpResponseRedirect('/admin-newsletters/')
                
        except Exception as e:
            error_message = f'Error deleting newsletter: {str(e)}'
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({
                    'success': False,
                    'message': error_message
                })
            else:
                messages.error(request, error_message)
                return HttpResponseRedirect('/admin-newsletters/')
    
    # GET request not allowed
    return HttpResponseRedirect('/admin-newsletters/')

def admin_newsletter_category_delete(request, category_id):
    """Delete newsletter category"""
    from django.http import HttpResponseRedirect, JsonResponse
    from django.shortcuts import get_object_or_404
    
    # Manual authentication check
    if not request.user.is_authenticated:
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({'error': 'Authentication required'}, status=401)
        return HttpResponseRedirect('/admin-login/')
    
    if not (request.user.is_staff or request.user.is_superuser):
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({'error': 'Permission denied'}, status=403)
        return HttpResponseRedirect('/admin-login/')
    
    if request.method == 'POST':
        try:
            category = get_object_or_404(SubscriptionCategory, id=category_id)
            category_name = category.name
            
            # Check if category has subscribers
            subscriber_count = category.subscriber_set.filter(active_status=True).count()
            if subscriber_count > 0:
                if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                    return JsonResponse({
                        'success': False,
                        'message': f'Cannot delete category "{category_name}" because it has {subscriber_count} active subscribers. Please move subscribers to another category first.'
                    })
                else:
                    messages.error(request, f'Cannot delete category "{category_name}" because it has {subscriber_count} active subscribers. Please move subscribers to another category first.')
                    return HttpResponseRedirect('/admin-newsletter-categories/')
            
            # Check if category has newsletters
            newsletter_count = Newsletter.objects.filter(categories=category).count()
            if newsletter_count > 0:
                if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                    return JsonResponse({
                        'success': False,
                        'message': f'Cannot delete category "{category_name}" because it has {newsletter_count} newsletters. Please remove the category from newsletters first.'
                    })
                else:
                    messages.error(request, f'Cannot delete category "{category_name}" because it has {newsletter_count} newsletters. Please remove the category from newsletters first.')
                    return HttpResponseRedirect('/admin-newsletter-categories/')
            
            # Delete the category
            category.delete()
            
            message = f'Category "{category_name}" has been deleted successfully.'
            
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({
                    'success': True,
                    'message': message
                })
            else:
                messages.success(request, message)
                return HttpResponseRedirect('/admin-newsletter-categories/')
                
        except Exception as e:
            error_message = f'Error deleting category: {str(e)}'
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({
                    'success': False,
                    'message': error_message
                })
            else:
                messages.error(request, error_message)
                return HttpResponseRedirect('/admin-newsletter-categories/')
    
    # GET request not allowed
    return HttpResponseRedirect('/admin-newsletter-categories/')

def admin_newsletter_edit(request, newsletter_id):
    """Edit existing newsletter"""
    from django.http import HttpResponseRedirect
    from django.shortcuts import get_object_or_404
    
    # Manual authentication check
    if not request.user.is_authenticated:
        return HttpResponseRedirect('/admin-login/')
    
    if not (request.user.is_staff or request.user.is_superuser):
        return HttpResponseRedirect('/admin-login/')
    
    try:
        newsletter = get_object_or_404(Newsletter, id=newsletter_id)
        
        # Check if newsletter has been sent
        if newsletter.sent:
            messages.error(request, 'Cannot edit a newsletter that has already been sent.')
            return HttpResponseRedirect('/admin-newsletters/')
        
        if request.method == 'POST':
            title = request.POST.get('title', '').strip()
            content = request.POST.get('content', '').strip()
            category_ids = request.POST.getlist('categories')
            send_immediately = request.POST.get('send_immediately') == 'on'
            
            # Validation
            if not title:
                messages.error(request, 'Newsletter title is required.')
                return render(request, 'axflo_app/admin/admin_newsletter_edit.html', {
                    'newsletter': newsletter,
                    'categories': SubscriptionCategory.objects.all(),
                    'selected_categories': newsletter.categories.all(),
                    'current_page': 'newsletter_edit'
                })
            
            if not content:
                messages.error(request, 'Newsletter content is required.')
                return render(request, 'axflo_app/admin/admin_newsletter_edit.html', {
                    'newsletter': newsletter,
                    'categories': SubscriptionCategory.objects.all(),
                    'selected_categories': newsletter.categories.all(),
                    'current_page': 'newsletter_edit'
                })
            
            try:
                # Update newsletter
                newsletter.title = title
                newsletter.content = content
                newsletter.sent = send_immediately
                if send_immediately:
                    newsletter.send_date = timezone.now()
                newsletter.save()
                
                # Update categories
                if category_ids:
                    categories = SubscriptionCategory.objects.filter(id__in=category_ids)
                    newsletter.categories.set(categories)
                else:
                    newsletter.categories.clear()
                
                # Update recipient count
                if category_ids:
                    recipients = Subscriber.objects.filter(
                        interests__in=category_ids,
                        active_status=True
                    ).distinct()
                else:
                    recipients = Subscriber.objects.filter(active_status=True)
                
                newsletter.recipient_count = recipients.count()
                newsletter.save()
                
                if send_immediately:
                    messages.success(request, f'Newsletter "{title}" updated and sent to {newsletter.recipient_count} subscribers!')
                else:
                    messages.success(request, f'Newsletter "{title}" updated successfully. Ready to send to {newsletter.recipient_count} subscribers.')
                
                return HttpResponseRedirect('/admin-newsletters/')
                
            except Exception as e:
                messages.error(request, f'Error updating newsletter: {str(e)}')
        
        # Handle GET request - show edit form
        categories = SubscriptionCategory.objects.all().order_by('name')
        selected_categories = newsletter.categories.all()
        
        context = {
            'newsletter': newsletter,
            'categories': categories,
            'selected_categories': selected_categories,
            'current_page': 'newsletter_edit'
        }
        
        return render(request, 'axflo_app/admin/admin_newsletter_edit.html', context)
        
    except Exception as e:
        messages.error(request, f'Error loading newsletter for editing: {str(e)}')
        return HttpResponseRedirect('/admin-newsletters/')

def admin_subscriber_toggle_status(request, subscriber_id):
    """Toggle subscriber active status"""
    from django.http import HttpResponseRedirect, JsonResponse
    from django.shortcuts import get_object_or_404
    
    # Manual authentication check
    if not request.user.is_authenticated:
        return HttpResponseRedirect('/admin-login/')
    
    if not (request.user.is_staff or request.user.is_superuser):
        return HttpResponseRedirect('/admin-login/')
    
    subscriber = get_object_or_404(Subscriber, id=subscriber_id)
    subscriber.active_status = not subscriber.active_status
    subscriber.save()
    
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return JsonResponse({
            'success': True,
            'active': subscriber.active_status
        })
    
    return HttpResponseRedirect('/admin-subscribers/')

def admin_subscriber_delete(request, subscriber_id):
    """Delete subscriber"""
    from django.http import HttpResponseRedirect, JsonResponse
    from django.shortcuts import get_object_or_404
    from django.contrib import messages
    
    # Manual authentication check
    if not request.user.is_authenticated:
        return HttpResponseRedirect('/admin-login/')
    
    if not (request.user.is_staff or request.user.is_superuser):
        return HttpResponseRedirect('/admin-login/')
    
    subscriber = get_object_or_404(Subscriber, id=subscriber_id)
    subscriber_email = subscriber.email
    subscriber.delete()
    
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return JsonResponse({
            'success': True,
            'message': f'Subscriber {subscriber_email} has been deleted successfully.'
        })
    
    messages.success(request, f'Subscriber {subscriber_email} has been deleted successfully.')
    return HttpResponseRedirect('/admin-subscribers/')

def submit_job_application(request):
    """Handle job application submission via AJAX"""
    if request.method == 'POST':
        try:
            # Get form data
            job_id = request.POST.get('job_id')
            full_name = request.POST.get('fullName', '').strip()
            email = request.POST.get('email', '').strip()
            phone = request.POST.get('phone', '').strip()
            experience = request.POST.get('experience')
            education = request.POST.get('education')
            cover_letter = request.POST.get('coverLetter', '').strip()
            resume = request.FILES.get('resume')
            
            # Validate required fields (job_id is optional for general applications)
            required_fields = [full_name, email, phone, experience, education, cover_letter, resume]
            
            if not all(required_fields):
                return JsonResponse({
                    'success': False,
                    'message': 'Please fill in all required fields and upload your resume.'
                })
            
            # Get job posting (handle both specific jobs and general applications)
            job_posting = None
            if job_id:
                try:
                    job_posting = JobPosting.objects.get(id=job_id, status='ACTIVE')
                except JobPosting.DoesNotExist:
                    return JsonResponse({
                        'success': False,
                        'message': 'Invalid job posting or position is no longer available.'
                    })
            else:
                # For general applications, create or get a default "General Application" job posting
                job_posting, created = JobPosting.objects.get_or_create(
                    title='General Application',
                    defaults={
                        'description': 'General application for future opportunities',
                        'requirements': 'Open to various qualifications',
                        'location': 'Various',
                        'department': 'Human Resources',
                        'employment_type': 'FULL_TIME',
                        'status': 'ACTIVE'
                    }
                )
            
            # Split full name
            name_parts = full_name.split(' ', 1)
            first_name = name_parts[0]
            last_name = name_parts[1] if len(name_parts) > 1 else ''
            
            # Create job application
            application = JobApplication.objects.create(
                job_posting=job_posting,
                first_name=first_name,
                last_name=last_name,
                email=email,
                phone=phone,
                address='',  # Address field is optional
                experience=experience,
                education=education,
                resume=resume,
                cover_letter=cover_letter,
                status='SUBMITTED'
            )
            
            if job_id:
                message = f'Thank you for applying to {job_posting.title}! We will review your application and get back to you soon.'
            else:
                message = 'Thank you for submitting your resume! We will review your application and contact you if suitable opportunities arise.'
            
            return JsonResponse({
                'success': True,
                'message': message
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'An error occurred while submitting your application. Please try again later.'
            })
    
    return JsonResponse({
        'success': False,
        'message': 'Invalid request method.'
    })

# Career Management Views for Admin
def admin_careers(request):
    """Custom admin view for managing job postings"""
    from django.http import HttpResponseRedirect
    from django.core.paginator import Paginator
    from django.db.models import Q
    
    # Manual authentication check
    if not request.user.is_authenticated:
        return HttpResponseRedirect('/admin-login/')
    
    if not (request.user.is_staff or request.user.is_superuser):
        return HttpResponseRedirect('/admin-login/')
    
    # Get filter parameters
    status_filter = request.GET.get('status', 'all')
    department_filter = request.GET.get('department', '')
    search_query = request.GET.get('search', '')
    
    # Base queryset
    jobs = JobPosting.objects.all()
    
    # Apply filters
    if status_filter != 'all':
        jobs = jobs.filter(status=status_filter)
    
    if department_filter:
        jobs = jobs.filter(department__icontains=department_filter)
    
    if search_query:
        jobs = jobs.filter(
            Q(title__icontains=search_query) |
            Q(description__icontains=search_query) |
            Q(requirements__icontains=search_query) |
            Q(location__icontains=search_query)
        )
    
    # Order by posted date (newest first)
    jobs = jobs.order_by('-posted_date')
    
    # Pagination
    paginator = Paginator(jobs, 15)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    context = {
        'jobs': page_obj,
        'status_filter': status_filter,
        'department_filter': department_filter,
        'search_query': search_query,
        'total_jobs': JobPosting.objects.count(),
        'active_jobs': JobPosting.objects.filter(status='ACTIVE').count(),
        'inactive_jobs': JobPosting.objects.filter(status='INACTIVE').count(),
    }
    
    return render(request, 'axflo_app/admin/careers.html', context)

def admin_career_create(request):
    """Create new job posting"""
    from django.http import HttpResponseRedirect
    
    # Manual authentication check
    if not request.user.is_authenticated:
        return HttpResponseRedirect('/admin-login/')
    
    if not (request.user.is_staff or request.user.is_superuser):
        return HttpResponseRedirect('/admin-login/')
    
    if request.method == 'POST':
        try:
            # Get form data
            title = request.POST.get('title', '').strip()
            description = request.POST.get('description', '').strip()
            requirements = request.POST.get('requirements', '').strip()
            location = request.POST.get('location', '').strip()
            department = request.POST.get('department', '').strip()
            employment_type = request.POST.get('employment_type', 'FULL_TIME')
            salary_range = request.POST.get('salary_range', '').strip()
            closing_date = request.POST.get('closing_date') or None
            
            # Validate required fields
            if not all([title, description, requirements, location, department]):
                messages.error(request, 'Please fill in all required fields.')
                return render(request, 'axflo_app/admin/career_create.html', {
                    'employment_types': JobPosting.EMPLOYMENT_TYPE_CHOICES,
                })
            
            # Create job posting
            job_posting = JobPosting.objects.create(
                title=title,
                description=description,
                requirements=requirements,
                location=location,
                department=department,
                employment_type=employment_type,
                salary_range=salary_range,
                closing_date=closing_date,
                status='ACTIVE'
            )
            
            messages.success(request, f'Job posting "{title}" created successfully!')
            return HttpResponseRedirect('/admin-careers/')
            
        except Exception as e:
            messages.error(request, 'An error occurred while creating the job posting.')
    
    # GET request - show create form
    context = {
        'employment_types': JobPosting.EMPLOYMENT_TYPE_CHOICES,
    }
    return render(request, 'axflo_app/admin/career_create.html', context)

def admin_career_edit(request, job_id):
    """Edit job posting"""
    from django.http import HttpResponseRedirect, Http404
    from django.shortcuts import get_object_or_404
    
    # Manual authentication check
    if not request.user.is_authenticated:
        return HttpResponseRedirect('/admin-login/')
    
    if not (request.user.is_staff or request.user.is_superuser):
        return HttpResponseRedirect('/admin-login/')
    
    # Get job posting
    try:
        job = get_object_or_404(JobPosting, id=job_id)
    except Http404:
        messages.error(request, 'Job posting not found.')
        return HttpResponseRedirect('/admin-careers/')
    
    if request.method == 'POST':
        try:
            # Get form data
            job.title = request.POST.get('title', '').strip()
            job.description = request.POST.get('description', '').strip()
            job.requirements = request.POST.get('requirements', '').strip()
            job.location = request.POST.get('location', '').strip()
            job.department = request.POST.get('department', '').strip()
            job.employment_type = request.POST.get('employment_type', 'FULL_TIME')
            job.salary_range = request.POST.get('salary_range', '').strip()
            job.status = request.POST.get('status', 'ACTIVE')
            closing_date = request.POST.get('closing_date') or None
            job.closing_date = closing_date
            
            # Validate required fields
            if not all([job.title, job.description, job.requirements, job.location, job.department]):
                messages.error(request, 'Please fill in all required fields.')
                return render(request, 'axflo_app/admin/career_edit.html', {
                    'job': job,
                    'employment_types': JobPosting.EMPLOYMENT_TYPE_CHOICES,
                    'status_choices': JobPosting.STATUS_CHOICES,
                })
            
            # Save job posting
            job.save()
            
            messages.success(request, f'Job posting "{job.title}" updated successfully!')
            return HttpResponseRedirect('/admin-careers/')
            
        except Exception as e:
            messages.error(request, 'An error occurred while updating the job posting.')
    
    # GET request - show edit form
    context = {
        'job': job,
        'employment_types': JobPosting.EMPLOYMENT_TYPE_CHOICES,
        'status_choices': JobPosting.STATUS_CHOICES,
    }
    return render(request, 'axflo_app/admin/career_edit.html', context)

def admin_career_delete(request, job_id):
    """Delete job posting with enhanced error handling"""
    from django.http import HttpResponseRedirect, JsonResponse
    from django.shortcuts import get_object_or_404
    
    # Manual authentication check
    if not request.user.is_authenticated:
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({'error': 'Authentication required'}, status=401)
        return HttpResponseRedirect('/admin-login/')
    
    if not (request.user.is_staff or request.user.is_superuser):
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({'error': 'Permission denied'}, status=403)
        return HttpResponseRedirect('/admin-login/')
    
    if request.method == 'POST':
        try:
            job = get_object_or_404(JobPosting, id=job_id)
            job_title = job.title
            
            # Count associated applications for the message
            application_count = job.jobapplication_set.count()
            
            # Delete the job posting (this will cascade to applications)
            job.delete()
            
            # Create appropriate success message
            if application_count > 0:
                message = f'Job posting "{job_title}" and {application_count} associated application(s) have been deleted successfully.'
            else:
                message = f'Job posting "{job_title}" has been deleted successfully.'
            
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({
                    'success': True,
                    'message': message
                })
            
            messages.success(request, message)
            return HttpResponseRedirect('/admin-careers/')
            
        except Exception as e:
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({
                    'success': False,
                    'error': f'Error deleting job posting: {str(e)}'
                }, status=500)
            
            messages.error(request, f'Error deleting job posting: {str(e)}')
            return HttpResponseRedirect('/admin-careers/')
    
    # If not POST request
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return JsonResponse({'error': 'Invalid request method'}, status=405)
    
    return HttpResponseRedirect('/admin-careers/')

def admin_applications(request):
    """Custom admin view for managing job applications"""
    from django.http import HttpResponseRedirect
    from django.core.paginator import Paginator
    from django.db.models import Q
    
    # Manual authentication check
    if not request.user.is_authenticated:
        return HttpResponseRedirect('/admin-login/')
    
    if not (request.user.is_staff or request.user.is_superuser):
        return HttpResponseRedirect('/admin-login/')
    
    # Get filter parameters
    status_filter = request.GET.get('status', 'all')
    job_filter = request.GET.get('job', 'all')
    search_query = request.GET.get('search', '')
    
    # Base queryset
    applications = JobApplication.objects.all()
    
    # Apply filters
    if status_filter != 'all':
        applications = applications.filter(status=status_filter)
    
    if job_filter != 'all':
        applications = applications.filter(job_posting_id=job_filter)
    
    if search_query:
        applications = applications.filter(
            Q(first_name__icontains=search_query) |
            Q(last_name__icontains=search_query) |
            Q(email__icontains=search_query) |
            Q(job_posting__title__icontains=search_query)
        )
    
    # Order by application date (newest first)
    applications = applications.order_by('-application_date')
    
    # Pagination
    paginator = Paginator(applications, 20)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    # Get jobs for filter dropdown
    jobs = JobPosting.objects.all().order_by('title')
    
    context = {
        'applications': page_obj,
        'jobs': jobs,
        'status_filter': status_filter,
        'job_filter': job_filter,
        'search_query': search_query,
        'total_applications': JobApplication.objects.count(),
        'new_applications': JobApplication.objects.filter(status='SUBMITTED').count(),
        'status_choices': JobApplication.APPLICATION_STATUS_CHOICES,
    }
    
    return render(request, 'axflo_app/admin/applications.html', context)

def admin_application_detail(request, application_id):
    """Get application details for modal display"""
    from django.http import HttpResponseRedirect, JsonResponse
    from django.shortcuts import get_object_or_404
    
    # Manual authentication check
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Authentication required'}, status=401)
    
    if not (request.user.is_staff or request.user.is_superuser):
        return JsonResponse({'error': 'Permission denied'}, status=403)
    
    try:
        application = get_object_or_404(JobApplication, id=application_id)
        
        data = {
            'success': True,
            'application': {
                'id': application.id,
                'full_name': f"{application.first_name} {application.last_name}",
                'email': application.email,
                'phone': application.phone,
                'address': application.address or 'Not provided',
                'job_title': application.job_posting.title,
                'job_department': application.job_posting.department,
                'status': application.get_status_display(),
                'status_code': application.status,
                'application_date': application.application_date.strftime('%B %d, %Y at %I:%M %p'),
                'cover_letter': application.cover_letter,
                'resume_url': application.resume.url if application.resume else None,
                'resume_name': application.resume.name.split('/')[-1] if application.resume else 'No resume',
                'notes': application.notes or 'No notes added',
                'experience': application.get_experience_display() if application.experience else 'Not specified',
                'education': application.get_education_display() if application.education else 'Not specified',
            }
        }
        
        return JsonResponse(data)
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': f'Error fetching application details: {str(e)}'
        }, status=500)

def admin_application_status(request, application_id):
    """Update application status"""
    from django.http import JsonResponse
    from django.shortcuts import get_object_or_404
    import json
    
    # Manual authentication check
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Authentication required'}, status=401)
    
    if not (request.user.is_staff or request.user.is_superuser):
        return JsonResponse({'error': 'Permission denied'}, status=403)
    
    if request.method == 'POST':
        try:
            application = get_object_or_404(JobApplication, id=application_id)
            
            # Parse JSON data
            data = json.loads(request.body)
            new_status = data.get('status')
            
            # Validate status
            valid_statuses = [choice[0] for choice in JobApplication.APPLICATION_STATUS_CHOICES]
            if new_status not in valid_statuses:
                return JsonResponse({
                    'success': False,
                    'error': 'Invalid status'
                }, status=400)
            
            # Update status
            application.status = new_status
            application.save()
            
            return JsonResponse({
                'success': True,
                'message': f'Application status updated to {application.get_status_display()}'
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': f'Error updating status: {str(e)}'
            }, status=500)
    
    return JsonResponse({'error': 'Invalid request method'}, status=405)

def admin_application_delete(request, application_id):
    """Delete job application"""
    from django.http import JsonResponse
    from django.shortcuts import get_object_or_404
    import os
    
    # Manual authentication check
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Authentication required'}, status=401)
    
    if not (request.user.is_staff or request.user.is_superuser):
        return JsonResponse({'error': 'Permission denied'}, status=403)
    
    if request.method == 'POST':
        try:
            application = get_object_or_404(JobApplication, id=application_id)
            
            # Store applicant name for success message
            applicant_name = f"{application.first_name} {application.last_name}"
            job_title = application.job_posting.title
            
            # Delete resume file if it exists
            if application.resume:
                try:
                    if os.path.isfile(application.resume.path):
                        os.remove(application.resume.path)
                except (ValueError, OSError):
                    # File doesn't exist or can't be deleted, continue anyway
                    pass
            
            # Delete the application
            application.delete()
            
            return JsonResponse({
                'success': True,
                'message': f'Application from {applicant_name} for {job_title} has been deleted successfully.'
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': f'Error deleting application: {str(e)}'
            }, status=500)
    
    return JsonResponse({'error': 'Invalid request method'}, status=405)

# ================================
# BLOG/NEWS MANAGEMENT VIEWS
# ================================

def admin_blog(request):
    """Custom admin view for managing blog posts"""
    from django.http import HttpResponseRedirect
    from django.core.paginator import Paginator
    from django.db.models import Q
    
    # Manual authentication check
    if not request.user.is_authenticated:
        return HttpResponseRedirect('/admin-login/')
    
    if not (request.user.is_staff or request.user.is_superuser):
        return HttpResponseRedirect('/admin-login/')
    
    # Get filter parameters
    status_filter = request.GET.get('status', 'all')
    category_filter = request.GET.get('category', 'all')
    search_query = request.GET.get('search', '')
    
    # Base queryset
    articles = NewsArticle.objects.all()
    
    # Apply filters
    if status_filter != 'all':
        articles = articles.filter(status=status_filter)
    
    if category_filter != 'all':
        articles = articles.filter(category_id=category_filter)
    
    if search_query:
        articles = articles.filter(
            Q(title__icontains=search_query) |
            Q(content__icontains=search_query) |
            Q(tags__icontains=search_query)
        )
    
    # Order by created date (newest first)
    articles = articles.order_by('-created_at')
    
    # Pagination
    paginator = Paginator(articles, 20)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    # Get categories for filter dropdown
    categories = BlogCategory.objects.all()
    
    context = {
        'articles': page_obj,
        'categories': categories,
        'status_filter': status_filter,
        'category_filter': category_filter,
        'search_query': search_query,
        'total_articles': NewsArticle.objects.count(),
        'published_articles': NewsArticle.objects.filter(status='PUBLISHED').count(),
        'draft_articles': NewsArticle.objects.filter(status='DRAFT').count(),
        'status_choices': NewsArticle.STATUS_CHOICES,
    }
    
    return render(request, 'axflo_app/admin/blog.html', context)

def admin_blog_create(request):
    """Create new blog post"""
    from django.http import HttpResponseRedirect
    from django.utils.text import slugify
    
    # Manual authentication check
    if not request.user.is_authenticated:
        return HttpResponseRedirect('/admin-login/')
    
    if not (request.user.is_staff or request.user.is_superuser):
        return HttpResponseRedirect('/admin-login/')
    
    if request.method == 'POST':
        try:
            # Get form data
            title = request.POST.get('title', '').strip()
            excerpt = request.POST.get('excerpt', '').strip()
            content = request.POST.get('content', '').strip()
            status = request.POST.get('status', 'DRAFT')
            category_id = request.POST.get('category') or None
            image_url = request.POST.get('image_url', '').strip()
            image_alt = request.POST.get('image_alt', '').strip()
            tags = request.POST.get('tags', '').strip()
            meta_description = request.POST.get('meta_description', '').strip()
            featured = request.POST.get('featured') == 'on'
            
            # Get uploaded image
            image = request.FILES.get('image')
            
            # Validate required fields
            if not all([title, content]):
                messages.error(request, 'Please fill in all required fields.')
                return render(request, 'axflo_app/admin/blog_create.html', {
                    'categories': BlogCategory.objects.all(),
                    'status_choices': NewsArticle.STATUS_CHOICES,
                })
            
            # Get category if specified
            category = None
            if category_id:
                try:
                    category = BlogCategory.objects.get(id=category_id)
                except BlogCategory.DoesNotExist:
                    pass
            
            # Create blog post
            article = NewsArticle.objects.create(
                title=title,
                slug=slugify(title),
                excerpt=excerpt,
                content=content,
                image=image,
                image_url=image_url,
                image_alt=image_alt,
                category=category,
                author=request.user,
                tags=tags,
                meta_description=meta_description,
                status=status,
                featured=featured
            )
            
            messages.success(request, f'Blog post "{title}" created successfully!')
            return HttpResponseRedirect('/admin-blog/')
            
        except Exception as e:
            messages.error(request, f'An error occurred while creating the blog post: {str(e)}')
    
    # GET request - show create form
    context = {
        'categories': BlogCategory.objects.all(),
        'status_choices': NewsArticle.STATUS_CHOICES,
    }
    return render(request, 'axflo_app/admin/blog_create.html', context)

def admin_blog_edit(request, article_id):
    """Edit blog post"""
    from django.http import HttpResponseRedirect, Http404
    from django.shortcuts import get_object_or_404
    from django.utils.text import slugify
    
    # Manual authentication check
    if not request.user.is_authenticated:
        return HttpResponseRedirect('/admin-login/')
    
    if not (request.user.is_staff or request.user.is_superuser):
        return HttpResponseRedirect('/admin-login/')
    
    # Get blog post
    try:
        article = get_object_or_404(NewsArticle, id=article_id)
    except Http404:
        messages.error(request, 'Blog post not found.')
        return HttpResponseRedirect('/admin-blog/')
    
    if request.method == 'POST':
        try:
            # Get form data
            article.title = request.POST.get('title', '').strip()
            article.excerpt = request.POST.get('excerpt', '').strip()
            article.content = request.POST.get('content', '').strip()
            article.status = request.POST.get('status', 'DRAFT')
            article.image_url = request.POST.get('image_url', '').strip()
            article.image_alt = request.POST.get('image_alt', '').strip()
            article.tags = request.POST.get('tags', '').strip()
            article.meta_description = request.POST.get('meta_description', '').strip()
            article.featured = request.POST.get('featured') == 'on'
            
            # Update slug if title changed
            article.slug = slugify(article.title)
            
            # Handle category
            category_id = request.POST.get('category') or None
            if category_id:
                try:
                    article.category = BlogCategory.objects.get(id=category_id)
                except BlogCategory.DoesNotExist:
                    article.category = None
            else:
                article.category = None
            
            # Handle uploaded image
            new_image = request.FILES.get('image')
            if new_image:
                article.image = new_image
            
            # Validate required fields
            if not all([article.title, article.content]):
                messages.error(request, 'Please fill in all required fields.')
                return render(request, 'axflo_app/admin/blog_edit.html', {
                    'article': article,
                    'categories': BlogCategory.objects.all(),
                    'status_choices': NewsArticle.STATUS_CHOICES,
                })
            
            # Save blog post
            article.save()
            
            messages.success(request, f'Blog post "{article.title}" updated successfully!')
            return HttpResponseRedirect('/admin-blog/')
            
        except Exception as e:
            messages.error(request, f'An error occurred while updating the blog post: {str(e)}')
    
    # GET request - show edit form
    context = {
        'article': article,
        'categories': BlogCategory.objects.all(),
        'status_choices': NewsArticle.STATUS_CHOICES,
    }
    return render(request, 'axflo_app/admin/blog_edit.html', context)

def admin_blog_delete(request, article_id):
    """Delete blog post"""
    from django.http import HttpResponseRedirect, JsonResponse
    from django.shortcuts import get_object_or_404
    import os
    
    # Manual authentication check
    if not request.user.is_authenticated:
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({'error': 'Authentication required'}, status=401)
        return HttpResponseRedirect('/admin-login/')
    
    if not (request.user.is_staff or request.user.is_superuser):
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({'error': 'Permission denied'}, status=403)
        return HttpResponseRedirect('/admin-login/')
    
    if request.method == 'POST':
        try:
            article = get_object_or_404(NewsArticle, id=article_id)
            article_title = article.title
            
            # Delete image file if it exists
            if article.image:
                try:
                    if os.path.isfile(article.image.path):
                        os.remove(article.image.path)
                except (ValueError, OSError):
                    # File doesn't exist or can't be deleted, continue anyway
                    pass
            
            # Delete the article
            article.delete()
            
            message = f'Blog post "{article_title}" has been deleted successfully.'
            
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({
                    'success': True,
                    'message': message
                })
            
            messages.success(request, message)
            return HttpResponseRedirect('/admin-blog/')
            
        except Exception as e:
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({
                    'success': False,
                    'error': f'Error deleting blog post: {str(e)}'
                }, status=500)
            
            messages.error(request, f'Error deleting blog post: {str(e)}')
            return HttpResponseRedirect('/admin-blog/')
    
    # If not POST request
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return JsonResponse({'error': 'Invalid request method'}, status=405)
    
    return HttpResponseRedirect('/admin-blog/')

def admin_blog_categories(request):
    """Manage blog categories"""
    from django.http import HttpResponseRedirect
    from django.core.paginator import Paginator
    from django.utils.text import slugify
    
    # Manual authentication check
    if not request.user.is_authenticated:
        return HttpResponseRedirect('/admin-login/')
    
    if not (request.user.is_staff or request.user.is_superuser):
        return HttpResponseRedirect('/admin-login/')
    
    # Handle category operations
    if request.method == 'POST':
        # Handle delete
        if 'delete_id' in request.POST:
            category_id = request.POST.get('delete_id')
            try:
                category = BlogCategory.objects.get(id=category_id)
                category_name = category.name
                category.delete()
                messages.success(request, f'Category "{category_name}" deleted successfully!')
            except BlogCategory.DoesNotExist:
                messages.error(request, 'Category not found.')
            except Exception as e:
                messages.error(request, f'Error deleting category: {str(e)}')
        
        # Handle edit
        elif 'edit_id' in request.POST:
            category_id = request.POST.get('edit_id')
            name = request.POST.get('name', '').strip()
            description = request.POST.get('description', '').strip()
            
            if name:
                try:
                    category = BlogCategory.objects.get(id=category_id)
                    category.name = name
                    category.description = description
                    category.slug = slugify(name)
                    category.save()
                    messages.success(request, f'Category "{name}" updated successfully!')
                except BlogCategory.DoesNotExist:
                    messages.error(request, 'Category not found.')
                except Exception as e:
                    messages.error(request, f'Error updating category: {str(e)}')
            else:
                messages.error(request, 'Category name is required.')
        
        # Handle create
        else:
            name = request.POST.get('name', '').strip()
            description = request.POST.get('description', '').strip()
            
            if name:
                try:
                    BlogCategory.objects.create(
                        name=name,
                        description=description,
                        slug=slugify(name)
                    )
                    messages.success(request, f'Category "{name}" created successfully!')
                except Exception as e:
                    messages.error(request, f'Error creating category: {str(e)}')
            else:
                messages.error(request, 'Category name is required.')
        
        return HttpResponseRedirect('/admin-blog-categories/')
    
    # Get all categories
    categories = BlogCategory.objects.all()
    
    # Pagination
    paginator = Paginator(categories, 20)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    context = {
        'categories': page_obj,
        'total_categories': BlogCategory.objects.count(),
    }
    
    return render(request, 'axflo_app/admin/blog_categories.html', context)


# ================================
# ACHIEVEMENTS ADMIN VIEWS
# ================================

@csrf_exempt
def admin_achievements(request):
    """Manage achievements"""
    from django.http import HttpResponseRedirect
    from django.db.models import Q, Count
    
    # Manual authentication check
    if not request.user.is_authenticated:
        return HttpResponseRedirect('/admin-login/')
    
    if not (request.user.is_staff or request.user.is_superuser):
        return HttpResponseRedirect('/admin-login/')
    
    # Handle achievement operations
    if request.method == 'POST':
        # Handle AJAX requests for CRUD operations
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            action = request.POST.get('action')
            
            if action == 'create' or action == 'update':
                achievement_id = request.POST.get('achievement_id')
                title = request.POST.get('title', '').strip()
                achievement_type = request.POST.get('achievement_type')
                category_id = request.POST.get('category')
                achievement_date = request.POST.get('achievement_date')
                short_description = request.POST.get('short_description', '').strip()
                description = request.POST.get('description', '').strip()
                external_link = request.POST.get('external_link', '').strip()
                impact_metrics = request.POST.get('impact_metrics', '').strip()
                status = request.POST.get('status', 'ACTIVE')
                featured = request.POST.get('featured') == 'on'
                display_order = request.POST.get('display_order', 0)
                
                try:
                    category = AchievementCategory.objects.get(id=category_id)
                    
                    # Parse impact metrics JSON
                    metrics_data = {}
                    if impact_metrics:
                        try:
                            metrics_data = json.loads(impact_metrics)
                        except json.JSONDecodeError:
                            return JsonResponse({'success': False, 'error': 'Invalid JSON format for impact metrics'})
                    
                    if achievement_id:  # Update
                        achievement = Achievement.objects.get(id=achievement_id)
                        achievement.title = title
                        achievement.achievement_type = achievement_type
                        achievement.category = category
                        achievement.achievement_date = achievement_date
                        achievement.short_description = short_description
                        achievement.description = description
                        achievement.external_link = external_link
                        achievement.impact_metrics = metrics_data
                        achievement.status = status
                        achievement.featured = featured
                        achievement.display_order = int(display_order)
                        
                        if request.FILES.get('featured_image'):
                            achievement.featured_image = request.FILES['featured_image']
                        
                        achievement.save()
                        return JsonResponse({'success': True, 'message': 'Achievement updated successfully!'})
                    else:  # Create
                        achievement = Achievement.objects.create(
                            title=title,
                            achievement_type=achievement_type,
                            category=category,
                            achievement_date=achievement_date,
                            short_description=short_description,
                            description=description,
                            external_link=external_link,
                            impact_metrics=metrics_data,
                            status=status,
                            featured=featured,
                            display_order=int(display_order)
                        )
                        
                        if request.FILES.get('featured_image'):
                            achievement.featured_image = request.FILES['featured_image']
                            achievement.save()
                        
                        return JsonResponse({'success': True, 'message': 'Achievement created successfully!'})
                        
                except AchievementCategory.DoesNotExist:
                    return JsonResponse({'success': False, 'error': 'Category not found'})
                except Achievement.DoesNotExist:
                    return JsonResponse({'success': False, 'error': 'Achievement not found'})
                except Exception as e:
                    return JsonResponse({'success': False, 'error': str(e)})
            
            elif action == 'get':
                achievement_id = request.POST.get('achievement_id')
                try:
                    achievement = Achievement.objects.get(id=achievement_id)
                    achievement_data = {
                        'id': achievement.id,
                        'title': achievement.title,
                        'achievement_type': achievement.achievement_type,
                        'achievement_type_display': achievement.get_achievement_type_display(),
                        'category_id': achievement.category.id,
                        'category_name': achievement.category.name,
                        'category_color': achievement.category.color,
                        'achievement_date': achievement.achievement_date.strftime('%Y-%m-%d'),
                        'short_description': achievement.short_description or '',
                        'description': achievement.description,
                        'external_link': achievement.external_link or '',
                        'impact_metrics': json.dumps(achievement.impact_metrics) if achievement.impact_metrics else '{}',
                        'status': achievement.status,
                        'status_display': achievement.get_status_display(),
                        'featured': achievement.featured,
                        'display_order': achievement.display_order,
                        'featured_image': achievement.featured_image.url if achievement.featured_image else None
                    }
                    return JsonResponse({'success': True, 'achievement': achievement_data})
                except Achievement.DoesNotExist:
                    return JsonResponse({'success': False, 'error': 'Achievement not found'})
                except Exception as e:
                    return JsonResponse({'success': False, 'error': str(e)})
            
            elif action == 'delete':
                achievement_id = request.POST.get('achievement_id')
                try:
                    achievement = Achievement.objects.get(id=achievement_id)
                    achievement_title = achievement.title
                    achievement.delete()
                    return JsonResponse({'success': True, 'message': f'Achievement "{achievement_title}" deleted successfully!'})
                except Achievement.DoesNotExist:
                    return JsonResponse({'success': False, 'error': 'Achievement not found'})
                except Exception as e:
                    return JsonResponse({'success': False, 'error': str(e)})
            
            elif action == 'toggle_featured':
                achievement_id = request.POST.get('achievement_id')
                try:
                    achievement = Achievement.objects.get(id=achievement_id)
                    achievement.featured = not achievement.featured
                    achievement.save()
                    return JsonResponse({'success': True, 'featured': achievement.featured})
                except Achievement.DoesNotExist:
                    return JsonResponse({'success': False, 'error': 'Achievement not found'})
                except Exception as e:
                    return JsonResponse({'success': False, 'error': str(e)})
            
            elif action == 'bulk_action':
                bulk_action = request.POST.get('bulk_action')
                achievement_ids = request.POST.getlist('achievement_ids[]')
                
                try:
                    achievements = Achievement.objects.filter(id__in=achievement_ids)
                    
                    if bulk_action == 'feature':
                        achievements.update(featured=True)
                        return JsonResponse({'success': True, 'message': f'{len(achievement_ids)} achievements featured successfully!'})
                    elif bulk_action == 'unfeature':
                        achievements.update(featured=False)
                        return JsonResponse({'success': True, 'message': f'{len(achievement_ids)} achievements unfeatured successfully!'})
                    elif bulk_action == 'archive':
                        achievements.update(status='ARCHIVED')
                        return JsonResponse({'success': True, 'message': f'{len(achievement_ids)} achievements archived successfully!'})
                    elif bulk_action == 'activate':
                        achievements.update(status='ACTIVE')
                        return JsonResponse({'success': True, 'message': f'{len(achievement_ids)} achievements activated successfully!'})
                    elif bulk_action == 'delete':
                        achievements.delete()
                        return JsonResponse({'success': True, 'message': f'{len(achievement_ids)} achievements deleted successfully!'})
                    else:
                        return JsonResponse({'success': False, 'error': 'Invalid bulk action'})
                        
                except Exception as e:
                    return JsonResponse({'success': False, 'error': str(e)})
            
            return JsonResponse({'success': False, 'error': 'Invalid action'})
    
    # Get filter parameters
    search_query = request.GET.get('search', '').strip()
    type_filter = request.GET.get('type', 'all')
    status_filter = request.GET.get('status', 'all')  
    category_filter = request.GET.get('category', 'all')
    
    # Base queryset
    achievements = Achievement.objects.select_related('category').order_by('-achievement_date', 'display_order')
    
    # Apply filters
    if search_query:
        achievements = achievements.filter(
            Q(title__icontains=search_query) |
            Q(description__icontains=search_query) |
            Q(short_description__icontains=search_query)
        )
    
    if type_filter != 'all':
        achievements = achievements.filter(achievement_type=type_filter)
    
    if status_filter != 'all':
        achievements = achievements.filter(status=status_filter)
    
    if category_filter != 'all':
        achievements = achievements.filter(category_id=category_filter)
    
    # Pagination
    paginator = Paginator(achievements, 20)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    # Stats
    total_achievements = Achievement.objects.count()
    featured_achievements = Achievement.objects.filter(featured=True).count()
    awards_count = Achievement.objects.filter(achievement_type='AWARD').count()
    certifications_count = Achievement.objects.filter(achievement_type='CERTIFICATION').count()
    
    # Categories
    categories = AchievementCategory.objects.all()
    categories_json = json.dumps([{
        'id': cat.id,
        'name': cat.name,
        'color': cat.color,
        'icon': cat.icon
    } for cat in categories], cls=DjangoJSONEncoder)
    
    context = {
        'current_page': 'achievements',
        'achievements': page_obj,
        'categories': categories,
        'categories_json': categories_json,
        'total_achievements': total_achievements,
        'featured_achievements': featured_achievements,
        'awards_count': awards_count,
        'certifications_count': certifications_count,
        'search_query': search_query,
        'type_filter': type_filter,
        'status_filter': status_filter,
        'category_filter': category_filter,
        'is_paginated': page_obj.has_other_pages(),
        'page_obj': page_obj,
        'paginator': paginator,
    }
    
    return render(request, 'axflo_app/admin/achievements.html', context)

@csrf_exempt
def admin_portfolio(request):
    """Manage project portfolio"""
    from django.http import HttpResponseRedirect
    from django.db.models import Q, Sum
    
    # Manual authentication check
    if not request.user.is_authenticated:
        return HttpResponseRedirect('/admin-login/')
    
    if not (request.user.is_staff or request.user.is_superuser):
        return HttpResponseRedirect('/admin-login/')
    
    # Handle portfolio operations
    if request.method == 'POST':
        # Handle AJAX requests for CRUD operations
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            action = request.POST.get('action')
            
            if action == 'create' or action == 'update':
                project_id = request.POST.get('project_id')
                title = request.POST.get('title', '').strip()
                client = request.POST.get('client', '').strip()
                location = request.POST.get('location', '').strip()
                project_type = request.POST.get('project_type')
                brief_description = request.POST.get('brief_description', '').strip()
                detailed_description = request.POST.get('detailed_description', '').strip()
                challenge = request.POST.get('challenge', '').strip()
                solution = request.POST.get('solution', '').strip() 
                results = request.POST.get('results', '').strip()
                start_date = request.POST.get('start_date')
                completion_date = request.POST.get('completion_date') or None
                duration_months = request.POST.get('duration_months') or None
                project_value = request.POST.get('project_value') or None
                environmental_impact = request.POST.get('environmental_impact', '').strip()
                key_statistics = request.POST.get('key_statistics', '').strip()
                meta_description = request.POST.get('meta_description', '').strip()
                tags = request.POST.get('tags', '').strip()
                status = request.POST.get('status', 'STANDARD')
                featured_on_homepage = request.POST.get('featured_on_homepage') == 'on'
                display_order = request.POST.get('display_order', 0)
                
                try:
                    # Parse JSON fields
                    environmental_data = {}
                    if environmental_impact:
                        try:
                            environmental_data = json.loads(environmental_impact)
                        except json.JSONDecodeError:
                            return JsonResponse({'success': False, 'error': 'Invalid JSON format for environmental impact'})
                    
                    statistics_data = {}
                    if key_statistics:
                        try:
                            statistics_data = json.loads(key_statistics)
                        except json.JSONDecodeError:
                            return JsonResponse({'success': False, 'error': 'Invalid JSON format for key statistics'})
                    
                    if project_id:  # Update
                        project = ProjectPortfolio.objects.get(id=project_id)
                        project.title = title
                        project.client = client
                        project.location = location
                        project.project_type = project_type
                        project.brief_description = brief_description
                        project.detailed_description = detailed_description
                        project.challenge = challenge
                        project.solution = solution
                        project.results = results
                        project.start_date = start_date
                        project.completion_date = completion_date
                        project.duration_months = int(duration_months) if duration_months else None
                        project.project_value = float(project_value) if project_value else None
                        project.environmental_impact = environmental_data
                        project.key_statistics = statistics_data
                        project.meta_description = meta_description
                        project.tags = tags
                        project.status = status
                        project.featured_on_homepage = featured_on_homepage
                        project.display_order = int(display_order)
                        
                        # Handle file uploads
                        if request.FILES.get('featured_image'):
                            project.featured_image = request.FILES['featured_image']
                        if request.FILES.get('before_image'):
                            project.before_image = request.FILES['before_image']
                        if request.FILES.get('after_image'):
                            project.after_image = request.FILES['after_image']
                        
                        project.save()
                        return JsonResponse({'success': True, 'message': 'Project updated successfully!'})
                    else:  # Create
                        project = ProjectPortfolio.objects.create(
                            title=title,
                            client=client,
                            location=location,
                            project_type=project_type,
                            brief_description=brief_description,
                            detailed_description=detailed_description,
                            challenge=challenge,
                            solution=solution,
                            results=results,
                            start_date=start_date,
                            completion_date=completion_date,
                            duration_months=int(duration_months) if duration_months else None,
                            project_value=float(project_value) if project_value else None,
                            environmental_impact=environmental_data,
                            key_statistics=statistics_data,
                            meta_description=meta_description,
                            tags=tags,
                            status=status,
                            featured_on_homepage=featured_on_homepage,
                            display_order=int(display_order)
                        )
                        
                        # Handle file uploads
                        if request.FILES.get('featured_image'):
                            project.featured_image = request.FILES['featured_image']
                        if request.FILES.get('before_image'):
                            project.before_image = request.FILES['before_image']
                        if request.FILES.get('after_image'):
                            project.after_image = request.FILES['after_image']
                            
                        if any([request.FILES.get('featured_image'), request.FILES.get('before_image'), request.FILES.get('after_image')]):
                            project.save()
                        
                        return JsonResponse({'success': True, 'message': 'Project created successfully!'})
                        
                except ProjectPortfolio.DoesNotExist:
                    return JsonResponse({'success': False, 'error': 'Project not found'})
                except Exception as e:
                    return JsonResponse({'success': False, 'error': str(e)})
            
            elif action == 'get':
                project_id = request.POST.get('project_id')
                try:
                    project = ProjectPortfolio.objects.get(id=project_id)
                    project_data = {
                        'id': project.id,
                        'title': project.title,
                        'client': project.client,
                        'location': project.location,
                        'project_type': project.project_type,
                        'project_type_display': project.get_project_type_display(),
                        'brief_description': project.brief_description,
                        'detailed_description': project.detailed_description or '',
                        'challenge': project.challenge or '',
                        'solution': project.solution or '',
                        'results': project.results or '',
                        'start_date': project.start_date.strftime('%Y-%m-%d'),
                        'completion_date': project.completion_date.strftime('%Y-%m-%d') if project.completion_date else '',
                        'duration_months': project.duration_months,
                        'project_value': str(project.project_value) if project.project_value else '',
                        'environmental_impact': json.dumps(project.environmental_impact) if project.environmental_impact else '{}',
                        'key_statistics': json.dumps(project.key_statistics) if project.key_statistics else '{}',
                        'meta_description': project.meta_description or '',
                        'tags': project.tags or '',
                        'status': project.status,
                        'status_display': project.get_status_display(),
                        'featured_on_homepage': project.featured_on_homepage,
                        'display_order': project.display_order,
                        'featured_image': project.featured_image.url if project.featured_image else None,
                        'before_image': project.before_image.url if project.before_image else None,
                        'after_image': project.after_image.url if project.after_image else None,
                        'gallery_images': project.gallery_images or '[]'
                    }
                    return JsonResponse({'success': True, 'project': project_data})
                except ProjectPortfolio.DoesNotExist:
                    return JsonResponse({'success': False, 'error': 'Project not found'})
                except Exception as e:
                    return JsonResponse({'success': False, 'error': str(e)})
            
            elif action == 'delete':
                project_id = request.POST.get('project_id')
                try:
                    project = ProjectPortfolio.objects.get(id=project_id)
                    project_title = project.title
                    project.delete()
                    return JsonResponse({'success': True, 'message': f'Project "{project_title}" deleted successfully!'})
                except ProjectPortfolio.DoesNotExist:
                    return JsonResponse({'success': False, 'error': 'Project not found'})
                except Exception as e:
                    return JsonResponse({'success': False, 'error': str(e)})
            
            elif action == 'toggle_featured':
                project_id = request.POST.get('project_id')
                try:
                    project = ProjectPortfolio.objects.get(id=project_id)
                    project.featured_on_homepage = not project.featured_on_homepage
                    project.save()
                    return JsonResponse({'success': True, 'featured': project.featured_on_homepage})
                except ProjectPortfolio.DoesNotExist:
                    return JsonResponse({'success': False, 'error': 'Project not found'})
                except Exception as e:
                    return JsonResponse({'success': False, 'error': str(e)})
            
            elif action == 'bulk_action':
                bulk_action = request.POST.get('bulk_action')
                project_ids = request.POST.getlist('project_ids[]')
                
                try:
                    projects = ProjectPortfolio.objects.filter(id__in=project_ids)
                    
                    if bulk_action == 'feature':
                        projects.update(featured_on_homepage=True)
                        return JsonResponse({'success': True, 'message': f'{len(project_ids)} projects featured successfully!'})
                    elif bulk_action == 'unfeature':
                        projects.update(featured_on_homepage=False)
                        return JsonResponse({'success': True, 'message': f'{len(project_ids)} projects unfeatured successfully!'})
                    elif bulk_action == 'archive':
                        projects.update(status='ARCHIVED')
                        return JsonResponse({'success': True, 'message': f'{len(project_ids)} projects archived successfully!'})
                    elif bulk_action == 'activate':
                        projects.update(status='ACTIVE')
                        return JsonResponse({'success': True, 'message': f'{len(project_ids)} projects activated successfully!'})
                    elif bulk_action == 'delete':
                        projects.delete()
                        return JsonResponse({'success': True, 'message': f'{len(project_ids)} projects deleted successfully!'})
                    else:
                        return JsonResponse({'success': False, 'error': 'Invalid bulk action'})
                
                except Exception as e:
                    return JsonResponse({'success': False, 'error': str(e)})
            
            return JsonResponse({'success': False, 'error': 'Invalid action'})
    
    # Get filter parameters
    search_query = request.GET.get('search', '').strip()
    type_filter = request.GET.get('project_type', 'all')
    status_filter = request.GET.get('status', 'all')
    year_filter = request.GET.get('year', 'all')
    
    # Base queryset
    projects = ProjectPortfolio.objects.order_by('-completion_date', 'display_order')
    
    # Apply filters
    if search_query:
        projects = projects.filter(
            Q(title__icontains=search_query) |
            Q(client__icontains=search_query) |
            Q(location__icontains=search_query) |
            Q(brief_description__icontains=search_query)
        )
    
    if type_filter != 'all':
        projects = projects.filter(project_type=type_filter)
    
    if status_filter != 'all':
        projects = projects.filter(status=status_filter)
    
    if year_filter != 'all':
        projects = projects.filter(completion_date__year=year_filter)
    
    # Pagination
    paginator = Paginator(projects, 12)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    # Stats
    total_projects = ProjectPortfolio.objects.count()
    featured_projects = ProjectPortfolio.objects.filter(featured_on_homepage=True).count()
    completed_projects = ProjectPortfolio.objects.filter(status__in=['FEATURED', 'STANDARD']).count()
    total_value = ProjectPortfolio.objects.aggregate(Sum('project_value'))['project_value__sum'] or 0
    total_value = total_value / 1000000  # Convert to millions
    
    # Available years
    available_years = ProjectPortfolio.objects.filter(
        completion_date__isnull=False
    ).dates('completion_date', 'year', order='DESC').values_list('completion_date__year', flat=True)
    available_years = list(set(available_years))
    
    context = {
        'current_page': 'portfolio',
        'projects': page_obj,
        'total_projects': total_projects,
        'featured_projects': featured_projects,
        'completed_projects': completed_projects,
        'total_value': total_value,
        'available_years': available_years,
        'search_query': search_query,
        'type_filter': type_filter,
        'status_filter': status_filter,
        'year_filter': year_filter,
        'is_paginated': page_obj.has_other_pages(),
        'page_obj': page_obj,
        'paginator': paginator,
    }
    
    return render(request, 'axflo_app/admin/portfolio.html', context)

@csrf_exempt
def admin_achievement_categories(request):
    """Manage achievement categories"""
    from django.http import HttpResponseRedirect
    
    # Manual authentication check
    if not request.user.is_authenticated:
        return HttpResponseRedirect('/admin-login/')
    
    if not (request.user.is_staff or request.user.is_superuser):
        return HttpResponseRedirect('/admin-login/')
    
    # Handle category operations
    if request.method == 'POST':
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            action = request.POST.get('action')
            
            if action == 'create' or action == 'update':
                category_id = request.POST.get('category_id')
                name = request.POST.get('name', '').strip()
                description = request.POST.get('description', '').strip()
                icon = request.POST.get('icon', 'fa-tag').strip()
                color = request.POST.get('color', '#d6a019').strip()
                
                try:
                    if category_id:  # Update
                        category = AchievementCategory.objects.get(id=category_id)
                        category.name = name
                        category.description = description
                        category.icon = icon
                        category.color = color
                        category.save()
                        return JsonResponse({'success': True, 'message': 'Category updated successfully!'})
                    else:  # Create
                        category = AchievementCategory.objects.create(
                            name=name,
                            description=description,
                            icon=icon,
                            color=color
                        )
                        return JsonResponse({'success': True, 'message': 'Category created successfully!'})
                        
                except AchievementCategory.DoesNotExist:
                    return JsonResponse({'success': False, 'error': 'Category not found'})
                except Exception as e:
                    return JsonResponse({'success': False, 'error': str(e)})
            
            elif action == 'get':
                category_id = request.POST.get('category_id')
                try:
                    category = AchievementCategory.objects.get(id=category_id)
                    category_data = {
                        'id': category.id,
                        'name': category.name,
                        'description': category.description or '',
                        'icon': category.icon or 'fa-trophy',
                        'color': category.color or '#d6a019'
                    }
                    return JsonResponse({'success': True, 'category': category_data})
                except AchievementCategory.DoesNotExist:
                    return JsonResponse({'success': False, 'error': 'Category not found'})
                except Exception as e:
                    return JsonResponse({'success': False, 'error': str(e)})
            
            elif action == 'view_achievements':
                category_id = request.POST.get('category_id')
                try:
                    category = AchievementCategory.objects.get(id=category_id)
                    achievements = category.achievements.all()
                    achievements_data = []
                    for achievement in achievements:
                        achievements_data.append({
                            'id': achievement.id,
                            'title': achievement.title,
                            'achievement_type_display': achievement.get_achievement_type_display(),
                            'achievement_date': achievement.achievement_date.strftime('%Y-%m-%d'),
                            'featured': achievement.featured,
                            'featured_image': achievement.featured_image.url if achievement.featured_image else None
                        })
                    
                    category_data = {
                        'id': category.id,
                        'name': category.name,
                        'description': category.description or '',
                        'icon': category.icon or 'fa-trophy',
                        'color': category.color or '#d6a019'
                    }
                    return JsonResponse({'success': True, 'category': category_data, 'achievements': achievements_data})
                except AchievementCategory.DoesNotExist:
                    return JsonResponse({'success': False, 'error': 'Category not found'})
                except Exception as e:
                    return JsonResponse({'success': False, 'error': str(e)})
            
            elif action == 'delete':
                category_id = request.POST.get('category_id')
                try:
                    category = AchievementCategory.objects.get(id=category_id)
                    if category.achievements.count() > 0:
                        return JsonResponse({'success': False, 'error': 'Cannot delete category with existing achievements'})
                    
                    category_name = category.name
                    category.delete()
                    return JsonResponse({'success': True, 'message': f'Category "{category_name}" deleted successfully!'})
                except AchievementCategory.DoesNotExist:
                    return JsonResponse({'success': False, 'error': 'Category not found'})
                except Exception as e:
                    return JsonResponse({'success': False, 'error': str(e)})
            
            return JsonResponse({'success': False, 'error': 'Invalid action'})
    
    # Get categories with achievement counts
    categories = AchievementCategory.objects.prefetch_related('achievements').order_by('name')
    
    # Stats
    total_categories = categories.count()
    total_achievements = Achievement.objects.count()
    categories_with_custom_colors = categories.exclude(color='#d6a019').count()
    
    # Categories JSON for JavaScript
    categories_json = json.dumps([{
        'id': cat.id,
        'name': cat.name,
        'description': cat.description,
        'icon': cat.icon,
        'color': cat.color,
        'achievement_count': cat.achievements.count()
    } for cat in categories], cls=DjangoJSONEncoder)
    
    context = {
        'current_page': 'achievement_categories',
        'categories': categories,
        'categories_json': categories_json,
        'total_categories': total_categories,
        'total_achievements': total_achievements,
        'categories_with_custom_colors': categories_with_custom_colors,
    }
    
    return render(request, 'axflo_app/admin/achievement_categories.html', context)

@csrf_exempt
def admin_milestones(request):
    """Manage company milestones"""
    from django.http import HttpResponseRedirect
    from django.db.models import Q
    from datetime import datetime
    
    # Manual authentication check
    if not request.user.is_authenticated:
        return HttpResponseRedirect('/admin-login/')
    
    if not (request.user.is_staff or request.user.is_superuser):
        return HttpResponseRedirect('/admin-login/')
    
    # Handle milestone operations
    if request.method == 'POST':
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            action = request.POST.get('action')
            
            if action == 'create' or action == 'update':
                milestone_id = request.POST.get('milestone_id')
                title = request.POST.get('title', '').strip()
                description = request.POST.get('description', '').strip()
                milestone_date = request.POST.get('milestone_date')
                icon = request.POST.get('icon', 'fa-flag').strip()
                featured = request.POST.get('featured') == 'on'
                display_order = request.POST.get('display_order', 0)
                
                try:
                    if milestone_id:  # Update
                        milestone = CompanyMilestone.objects.get(id=milestone_id)
                        milestone.title = title
                        milestone.description = description
                        milestone.milestone_date = milestone_date
                        milestone.icon = icon
                        milestone.featured = featured
                        milestone.display_order = int(display_order)
                        
                        if request.FILES.get('image'):
                            milestone.image = request.FILES['image']
                        
                        milestone.save()
                        return JsonResponse({'success': True, 'message': 'Milestone updated successfully!'})
                    else:  # Create
                        milestone = CompanyMilestone.objects.create(
                            title=title,
                            description=description,
                            milestone_date=milestone_date,
                            icon=icon,
                            featured=featured,
                            display_order=int(display_order)
                        )
                        
                        if request.FILES.get('image'):
                            milestone.image = request.FILES['image']
                            milestone.save()
                        
                        return JsonResponse({'success': True, 'message': 'Milestone created successfully!'})
                        
                except CompanyMilestone.DoesNotExist:
                    return JsonResponse({'success': False, 'error': 'Milestone not found'})
                except Exception as e:
                    return JsonResponse({'success': False, 'error': str(e)})
            
            elif action == 'get':
                milestone_id = request.POST.get('milestone_id')
                try:
                    milestone = CompanyMilestone.objects.get(id=milestone_id)
                    milestone_data = {
                        'id': milestone.id,
                        'title': milestone.title,
                        'description': milestone.description,
                        'milestone_date': milestone.milestone_date.strftime('%Y-%m-%d'),
                        'milestone_year': milestone.milestone_date.year,
                        'icon': milestone.icon or 'fa-flag',
                        'featured': milestone.featured,
                        'display_order': milestone.display_order,
                        'image': milestone.image.url if milestone.image else None
                    }
                    return JsonResponse({'success': True, 'milestone': milestone_data})
                except CompanyMilestone.DoesNotExist:
                    return JsonResponse({'success': False, 'error': 'Milestone not found'})
                except Exception as e:
                    return JsonResponse({'success': False, 'error': str(e)})
            
            elif action == 'delete':
                milestone_id = request.POST.get('milestone_id')
                try:
                    milestone = CompanyMilestone.objects.get(id=milestone_id)
                    milestone_title = milestone.title
                    milestone.delete()
                    return JsonResponse({'success': True, 'message': f'Milestone "{milestone_title}" deleted successfully!'})
                except CompanyMilestone.DoesNotExist:
                    return JsonResponse({'success': False, 'error': 'Milestone not found'})
                except Exception as e:
                    return JsonResponse({'success': False, 'error': str(e)})
            
            elif action == 'toggle_featured':
                milestone_id = request.POST.get('milestone_id')
                try:
                    milestone = CompanyMilestone.objects.get(id=milestone_id)
                    milestone.featured = not milestone.featured
                    milestone.save()
                    return JsonResponse({'success': True, 'featured': milestone.featured})
                except CompanyMilestone.DoesNotExist:
                    return JsonResponse({'success': False, 'error': 'Milestone not found'})
                except Exception as e:
                    return JsonResponse({'success': False, 'error': str(e)})
            
            elif action == 'bulk_action':
                bulk_action = request.POST.get('bulk_action')
                milestone_ids = request.POST.getlist('milestone_ids[]')
                
                try:
                    milestones = CompanyMilestone.objects.filter(id__in=milestone_ids)
                    
                    if bulk_action == 'feature':
                        milestones.update(featured=True)
                        return JsonResponse({'success': True, 'message': f'{len(milestone_ids)} milestones featured successfully!'})
                    elif bulk_action == 'unfeature':
                        milestones.update(featured=False)
                        return JsonResponse({'success': True, 'message': f'{len(milestone_ids)} milestones unfeatured successfully!'})
                    elif bulk_action == 'delete':
                        milestones.delete()
                        return JsonResponse({'success': True, 'message': f'{len(milestone_ids)} milestones deleted successfully!'})
                    else:
                        return JsonResponse({'success': False, 'error': 'Invalid bulk action'})
                
                except Exception as e:
                    return JsonResponse({'success': False, 'error': str(e)})
            
            return JsonResponse({'success': False, 'error': 'Invalid action'})
    
    # Get filter parameters
    search_query = request.GET.get('search', '').strip()
    year_filter = request.GET.get('year', 'all')
    featured_filter = request.GET.get('featured', 'all')
    
    # Base queryset
    milestones = CompanyMilestone.objects.order_by('-milestone_date', 'display_order')
    
    # Apply filters
    if search_query:
        milestones = milestones.filter(
            Q(title__icontains=search_query) |
            Q(description__icontains=search_query)
        )
    
    if year_filter != 'all':
        milestones = milestones.filter(milestone_year=year_filter)
    
    if featured_filter == 'yes':
        milestones = milestones.filter(featured=True)
    elif featured_filter == 'no':
        milestones = milestones.filter(featured=False)
    
    # Pagination
    paginator = Paginator(milestones, 20)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    # Stats
    total_milestones = CompanyMilestone.objects.count()
    featured_milestones = CompanyMilestone.objects.filter(featured=True).count()
    current_year = datetime.now().year
    this_year_milestones = CompanyMilestone.objects.filter(milestone_year=current_year).count()
    
    # Calculate years span
    earliest = CompanyMilestone.objects.order_by('milestone_date').first()
    years_span = current_year - earliest.milestone_year if earliest else 0
    
    # Available years
    available_years = CompanyMilestone.objects.values_list('milestone_year', flat=True).distinct().order_by('-milestone_year')
    
    # Milestones JSON for JavaScript
    milestones_json = json.dumps([{
        'id': milestone.id,
        'title': milestone.title,
        'description': milestone.description,
        'milestone_date': milestone.milestone_date.isoformat(),
        'milestone_year': milestone.milestone_year,
        'icon': milestone.icon,
        'featured': milestone.featured
    } for milestone in page_obj], cls=DjangoJSONEncoder)
    
    context = {
        'current_page': 'milestones',
        'milestones': page_obj,
        'milestones_json': milestones_json,
        'total_milestones': total_milestones,
        'featured_milestones': featured_milestones,
        'years_span': years_span,
        'this_year_milestones': this_year_milestones,
        'available_years': available_years,
        'search_query': search_query,
        'year_filter': year_filter,
        'featured_filter': featured_filter,
        'is_paginated': page_obj.has_other_pages(),
        'page_obj': page_obj,
        'paginator': paginator,
    }
    
    return render(request, 'axflo_app/admin/milestones.html', context)

# ================================
# CUSTOM PROFILE MANAGEMENT VIEWS
# ================================

def admin_profile_view(request):
    """Custom admin view to display user profile"""
    try:
        # Check if user is authenticated and has staff permissions
        if not request.user.is_authenticated:
            return HttpResponseRedirect('/admin-login/')
        
        if not request.user.is_staff:
            return HttpResponseRedirect('/admin-login/')
        
        # Get user stats
        user_stats = {
            'total_logins': 'N/A',  # You can track this if needed
            'last_login': request.user.last_login,
            'date_joined': request.user.date_joined,
            'is_superuser': request.user.is_superuser,
            'is_staff': request.user.is_staff,
            'is_active': request.user.is_active,
        }
        
        context = {
            'user_profile': request.user,
            'user_stats': user_stats,
            'current_page': 'profile_view'
        }
        
        return render(request, 'axflo_app/admin/profile_view.html', context)
        
    except Exception as e:
        messages.error(request, f'Error loading profile: {str(e)}')
        return HttpResponseRedirect('/admindashboard/')

def admin_profile_edit(request):
    """Custom admin view to edit user profile"""
    try:
        # Check if user is authenticated and has staff permissions
        if not request.user.is_authenticated:
            return HttpResponseRedirect('/admin-login/')
        
        if not request.user.is_staff:
            return HttpResponseRedirect('/admin-login/')
        
        if request.method == 'POST':
            # Get form data
            first_name = request.POST.get('first_name', '').strip()
            last_name = request.POST.get('last_name', '').strip()
            email = request.POST.get('email', '').strip()
            username = request.POST.get('username', '').strip()
            
            # Validation
            errors = []
            
            if not username:
                errors.append('Username is required.')
            elif User.objects.filter(username=username).exclude(id=request.user.id).exists():
                errors.append('Username already exists.')
            
            if email:
                try:
                    validate_email(email)
                    if User.objects.filter(email=email).exclude(id=request.user.id).exists():
                        errors.append('Email already exists.')
                except ValidationError:
                    errors.append('Invalid email format.')
            
            if errors:
                for error in errors:
                    messages.error(request, error)
                return render(request, 'axflo_app/admin/profile_edit.html', {
                    'user_profile': request.user,
                    'current_page': 'profile_edit'
                })
            
            # Update user profile
            try:
                request.user.first_name = first_name
                request.user.last_name = last_name
                request.user.email = email
                request.user.username = username
                request.user.save()
                
                messages.success(request, 'Profile updated successfully!')
                return HttpResponseRedirect('/admin-profile-view/')
                
            except Exception as e:
                messages.error(request, f'Error updating profile: {str(e)}')
        
        context = {
            'user_profile': request.user,
            'current_page': 'profile_edit'
        }
        
        return render(request, 'axflo_app/admin/profile_edit.html', context)
        
    except Exception as e:
        messages.error(request, f'Error loading profile editor: {str(e)}')
        return HttpResponseRedirect('/admindashboard/')

def admin_profile_password_change(request):
    """Custom admin view to change user password"""
    try:
        # Check if user is authenticated and has staff permissions
        if not request.user.is_authenticated:
            return HttpResponseRedirect('/admin-login/')
        
        if not request.user.is_staff:
            return HttpResponseRedirect('/admin-login/')
        
        if request.method == 'POST':
            form = PasswordChangeForm(request.user, request.POST)
            if form.is_valid():
                user = form.save()
                update_session_auth_hash(request, user)  # Important for keeping user logged in
                messages.success(request, 'Your password was successfully updated!')
                return HttpResponseRedirect('/admin-profile-view/')
            else:
                for field, errors in form.errors.items():
                    for error in errors:
                        messages.error(request, f'{field}: {error}')
        else:
            form = PasswordChangeForm(request.user)
        
        context = {
            'form': form,
            'user_profile': request.user,
            'current_page': 'profile_password'
        }
        
        return render(request, 'axflo_app/admin/profile_password_change.html', context)
        
    except Exception as e:
        messages.error(request, f'Error loading password change form: {str(e)}')
        return HttpResponseRedirect('/admindashboard/')

def admin_profile_delete(request):
    """Custom admin view to delete user account (self-deletion)"""
    try:
        # Check if user is authenticated and has staff permissions
        if not request.user.is_authenticated:
            return HttpResponseRedirect('/admin-login/')
        
        if not request.user.is_staff:
            return HttpResponseRedirect('/admin-login/')
        
        if request.method == 'POST':
            confirm = request.POST.get('confirm_delete')
            if confirm == 'DELETE_MY_ACCOUNT':
                try:
                    username = request.user.username
                    request.user.delete()
                    messages.success(request, f'Account {username} has been successfully deleted.')
                    return HttpResponseRedirect('/admin-login/')
                except Exception as e:
                    messages.error(request, f'Error deleting account: {str(e)}')
            else:
                messages.error(request, 'Please type "DELETE_MY_ACCOUNT" to confirm account deletion.')
        
        context = {
            'user_profile': request.user,
            'current_page': 'profile_delete'
        }
        
        return render(request, 'axflo_app/admin/profile_delete.html', context)
        
    except Exception as e:
        messages.error(request, f'Error loading account deletion page: {str(e)}')
        return HttpResponseRedirect('/admindashboard/')
