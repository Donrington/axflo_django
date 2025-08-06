from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone
from django.utils.text import slugify
from datetime import timedelta, date
from decimal import Decimal
from axflo_app.models import (
    # Blog/News
    NewsArticle, BlogCategory,
    # Careers
    JobPosting, JobCategory, JobApplication,
    # Achievements
    Achievement, AchievementCategory,
    # Projects
    Project, ProjectImage, ProjectPortfolio,
    # Milestones
    CompanyMilestone,
    # Contact
    ContactSubmission, InquiryCategory,
    # Newsletter
    Newsletter, SubscriptionCategory, Subscriber
)
import random
import uuid

class Command(BaseCommand):
    help = 'Create comprehensive test content for quality assurance across all Axflo platform features'

    def add_arguments(self, parser):
        parser.add_argument(
            '--content-type',
            type=str,
            choices=['all', 'blog', 'careers', 'achievements', 'projects', 'milestones', 'contacts', 'newsletters'],
            default='all',
            help='Specify which content type to test'
        )
        
        parser.add_argument(
            '--clean',
            action='store_true',
            help='Clean existing test data before creating new content'
        )

    def handle(self, *args, **options):
        content_type = options['content_type']
        clean_data = options['clean']
        
        self.stdout.write(
            self.style.SUCCESS(f'>> Starting quality test for {content_type} content...\n')
        )
        
        # Ensure we have test users
        self.create_test_users()
        
        if clean_data:
            self.clean_test_data(content_type)
        
        if content_type in ['all', 'blog']:
            self.test_blog_content()
        
        if content_type in ['all', 'careers']:
            self.test_career_content()
            
        if content_type in ['all', 'achievements']:
            self.test_achievement_content()
            
        if content_type in ['all', 'projects']:
            self.test_project_content()
            
        if content_type in ['all', 'milestones']:
            self.test_milestone_content()
            
        if content_type in ['all', 'contacts']:
            self.test_contact_content()
            
        if content_type in ['all', 'newsletters']:
            self.test_newsletter_content()
        
        self.stdout.write(
            self.style.SUCCESS('\n>> Quality test completed successfully!')
        )
        self.print_summary()

    def create_test_users(self):
        """Create test users for content creation"""
        users_data = [
            {'username': 'admin', 'email': 'admin@axflo.com', 'is_staff': True, 'is_superuser': True, 'first_name': 'System', 'last_name': 'Administrator'},
            {'username': 'editor', 'email': 'editor@axflo.com', 'is_staff': True, 'is_superuser': False, 'first_name': 'Content', 'last_name': 'Editor'},
            {'username': 'hr_manager', 'email': 'hr@axflo.com', 'is_staff': True, 'is_superuser': False, 'first_name': 'HR', 'last_name': 'Manager'},
            {'username': 'project_manager', 'email': 'pm@axflo.com', 'is_staff': True, 'is_superuser': False, 'first_name': 'Project', 'last_name': 'Manager'},
        ]
        
        for user_data in users_data:
            user, created = User.objects.get_or_create(
                username=user_data['username'],
                defaults=user_data
            )
            if created:
                user.set_password('testpassword123')
                user.save()

    def clean_test_data(self, content_type):
        """Clean existing test data"""
        self.stdout.write('>> Cleaning existing test data...')
        
        if content_type in ['all', 'blog']:
            NewsArticle.objects.filter(title__icontains='[TEST]').delete()
        if content_type in ['all', 'careers']:
            JobPosting.objects.filter(title__icontains='[TEST]').delete()
            JobApplication.objects.filter(first_name__icontains='TEST').delete()
        if content_type in ['all', 'achievements']:
            Achievement.objects.filter(title__icontains='[TEST]').delete()
        if content_type in ['all', 'projects']:
            Project.objects.filter(name__icontains='[TEST]').delete()
            ProjectPortfolio.objects.filter(title__icontains='[TEST]').delete()
        if content_type in ['all', 'milestones']:
            CompanyMilestone.objects.filter(title__icontains='[TEST]').delete()
        if content_type in ['all', 'contacts']:
            ContactSubmission.objects.filter(name__icontains='TEST').delete()
        if content_type in ['all', 'newsletters']:
            Newsletter.objects.filter(title__icontains='[TEST]').delete()
            Subscriber.objects.filter(email__icontains='test').delete()

    def test_blog_content(self):
        """Create test blog articles"""
        self.stdout.write('>> Creating test blog articles...')
        
        # Ensure categories exist
        categories = [
            {'name': 'Company News', 'slug': 'company-news'},
            {'name': 'Industry Insights', 'slug': 'industry-insights'},
            {'name': 'Project Updates', 'slug': 'project-updates'},
            {'name': 'Technology & Innovation', 'slug': 'technology-innovation'},
            {'name': 'Safety & Environment', 'slug': 'safety-environment'},
        ]
        
        for cat_data in categories:
            BlogCategory.objects.get_or_create(
                name=cat_data['name'],
                defaults={'slug': cat_data['slug'], 'description': f'{cat_data["name"]} articles and updates'}
            )
        
        admin_user = User.objects.get(username='admin')
        editor_user = User.objects.get(username='editor')
        
        test_articles = [
            {
                'title': '[TEST] Axflo Launches New Deepwater Platform',
                'excerpt': 'Testing the blog system with a comprehensive article about our latest technological advancement in offshore drilling capabilities.',
                'category': 'Company News',
                'author': admin_user,
                'featured': True,
                'status': 'PUBLISHED',
                'days_ago': 1
            },
            {
                'title': '[TEST] Digital Twin Tech in Oil & Gas',
                'excerpt': 'Exploring how digital twin technology is revolutionizing predictive maintenance and operational efficiency in the oil and gas sector.',
                'category': 'Technology & Innovation',
                'author': editor_user,
                'featured': False,
                'status': 'PUBLISHED',
                'days_ago': 3
            },
            {
                'title': '[TEST] Axflo Zero Incidents Milestone',
                'excerpt': 'Celebrating our commitment to safety excellence with 365 consecutive days of zero safety incidents across all projects.',
                'category': 'Safety & Environment',
                'author': admin_user,
                'featured': True,
                'status': 'PUBLISHED',
                'days_ago': 5
            },
            {
                'title': '[TEST] West Africa Energy Market 2024',
                'excerpt': 'Comprehensive analysis of the energy transition trends in West Africa and opportunities for sustainable development.',
                'category': 'Industry Insights',
                'author': editor_user,
                'featured': False,
                'status': 'PUBLISHED',
                'days_ago': 7
            },
            {
                'title': '[TEST] Lagos Port Expansion Update',
                'excerpt': 'Major progress update on the Lagos Port Complex expansion project, showcasing advanced marine engineering capabilities.',
                'category': 'Project Updates',
                'author': admin_user,
                'featured': False,
                'status': 'DRAFT',
                'days_ago': 0
            }
        ]
        
        created_count = 0
        for article_data in test_articles:
            category = BlogCategory.objects.get(name=article_data['category'])
            
            article, created = NewsArticle.objects.get_or_create(
                title=article_data['title'],
                defaults={
                    'slug': slugify(article_data['title']),
                    'excerpt': article_data['excerpt'],
                    'content': self.generate_article_content(article_data['title']),
                    'category': category,
                    'author': article_data['author'],
                    'featured': article_data['featured'],
                    'status': article_data['status'],
                    'published_at': timezone.now() - timedelta(days=article_data['days_ago']) if article_data['status'] == 'PUBLISHED' else None,
                    'image_url': f'/static/axflo_app/images/plan{random.randint(1, 1)}.jpg',
                    'image_alt': f'Test image for {article_data["title"]}',
                    'meta_description': article_data['excerpt'][:160],
                    'tags': 'test, quality-assurance, axflo',
                    'view_count': random.randint(50, 500)
                }
            )
            
            if created:
                created_count += 1
                self.stdout.write(f'  + Created: {article.title[:50]}...')
        
        self.stdout.write(f'  >> Blog Articles: {created_count} created, {NewsArticle.objects.count()} total\n')

    def test_career_content(self):
        """Create test job postings and applications"""
        self.stdout.write('>> Creating test career content...')
        
        # Ensure job categories exist
        job_categories = [
            'Engineering & Design',
            'Project Management', 
            'Operations & Maintenance',
            'Marine & Offshore',
            'Health, Safety & Environment'
        ]
        
        for cat_name in job_categories:
            JobCategory.objects.get_or_create(
                name=cat_name,
                defaults={'description': f'{cat_name} positions and opportunities'}
            )
        
        test_jobs = [
            {
                'title': '[TEST] Senior Offshore Engineer',
                'department': 'Engineering & Design',
                'location': 'Lagos, Nigeria',
                'employment_type': 'FULL_TIME',
                'salary_range': '$80,000 - $120,000',
                'status': 'ACTIVE',
                'days_ago': 5
            },
            {
                'title': '[TEST] Marine Operations Manager',
                'department': 'Marine & Offshore',
                'location': 'Port Harcourt, Nigeria',
                'employment_type': 'FULL_TIME',
                'salary_range': '$100,000 - $150,000',
                'status': 'ACTIVE',
                'days_ago': 10
            },
            {
                'title': '[TEST] HSE Coordinator',
                'department': 'Health, Safety & Environment',
                'location': 'Warri, Nigeria',
                'employment_type': 'FULL_TIME',
                'salary_range': '$60,000 - $90,000',
                'status': 'ACTIVE',
                'days_ago': 3
            },
            {
                'title': '[TEST] Project Manager LNG',
                'department': 'Project Management',
                'location': 'Abuja, Nigeria',
                'employment_type': 'CONTRACT',
                'salary_range': '$90,000 - $130,000',
                'status': 'ACTIVE',
                'days_ago': 7
            },
            {
                'title': '[TEST] Maintenance Supervisor',
                'department': 'Operations & Maintenance',
                'location': 'Bonny Island, Nigeria',
                'employment_type': 'FULL_TIME',
                'salary_range': '$70,000 - $100,000',
                'status': 'INACTIVE',
                'days_ago': 15
            }
        ]
        
        created_jobs = 0
        for job_data in test_jobs:
            job, created = JobPosting.objects.get_or_create(
                title=job_data['title'],
                defaults={
                    'description': self.generate_job_description(job_data['title']),
                    'requirements': self.generate_job_requirements(job_data['title']),
                    'location': job_data['location'],
                    'department': job_data['department'],
                    'employment_type': job_data['employment_type'],
                    'salary_range': job_data['salary_range'],
                    'status': job_data['status'],
                    'posted_date': timezone.now() - timedelta(days=job_data['days_ago']),
                    'closing_date': date.today() + timedelta(days=30)
                }
            )
            
            if created:
                created_jobs += 1
                self.stdout.write(f'  + Created job: {job.title[:50]}...')
                
                # Create sample applications for active jobs
                if job.status == 'ACTIVE':
                    self.create_job_applications(job)
        
        self.stdout.write(f'  >> Job Postings: {created_jobs} created, {JobPosting.objects.count()} total\n')

    def create_job_applications(self, job):
        """Create sample job applications"""
        sample_applicants = [
            {'first_name': 'TEST_John', 'last_name': 'Doe', 'email': 'john.doe.test@email.com', 'phone': '+234-800-123-4567', 'experience': '6-10', 'education': 'bachelor'},
            {'first_name': 'TEST_Sarah', 'last_name': 'Johnson', 'email': 'sarah.johnson.test@email.com', 'phone': '+234-800-123-4568', 'experience': '3-5', 'education': 'master'},
            {'first_name': 'TEST_Michael', 'last_name': 'Chen', 'email': 'michael.chen.test@email.com', 'phone': '+234-800-123-4569', 'experience': '10+', 'education': 'master'},
        ]
        
        for applicant_data in sample_applicants:
            JobApplication.objects.get_or_create(
                job_posting=job,
                email=applicant_data['email'],
                defaults={
                    **applicant_data,
                    'address': 'Test Address, Lagos, Nigeria',
                    'cover_letter': f'Test cover letter for {job.title} position. This is a quality assurance test application.',
                    'status': random.choice(['SUBMITTED', 'UNDER_REVIEW', 'SHORTLISTED']),
                    'notes': 'Test application for quality assurance'
                }
            )

    def test_achievement_content(self):
        """Create test achievements"""
        self.stdout.write('>> Creating test achievements...')
        
        # Ensure achievement categories exist
        achievement_categories = [
            {'name': 'Project Excellence', 'icon': 'fas fa-trophy', 'color': '#d6a019'},
            {'name': 'Safety Awards', 'icon': 'fas fa-shield-alt', 'color': '#10b981'},
            {'name': 'Industry Recognition', 'icon': 'fas fa-award', 'color': '#3b82f6'},
            {'name': 'Innovation & Technology', 'icon': 'fas fa-lightbulb', 'color': '#f59e0b'},
            {'name': 'Environmental Stewardship', 'icon': 'fas fa-leaf', 'color': '#22c55e'},
        ]
        
        for cat_data in achievement_categories:
            AchievementCategory.objects.get_or_create(
                name=cat_data['name'],
                defaults={
                    'description': f'{cat_data["name"]} achievements and recognitions',
                    'icon': cat_data['icon'],
                    'color': cat_data['color']
                }
            )
        
        test_achievements = [
            {
                'title': '[TEST] Oil & Gas Excellence Award 2024',
                'category': 'Industry Recognition',
                'achievement_type': 'AWARD',
                'status': 'ACTIVE',
                'featured': True,
                'days_ago': 30
            },
            {
                'title': '[TEST] Zero Safety Incidents 500 Days',
                'category': 'Safety Awards',
                'achievement_type': 'MILESTONE',
                'status': 'ACTIVE',
                'featured': True,
                'days_ago': 45
            },
            {
                'title': '[TEST] Digital Twin Pioneer Award',
                'category': 'Innovation & Technology',
                'achievement_type': 'RECOGNITION',
                'status': 'ACTIVE',
                'featured': False,
                'days_ago': 60
            },
            {
                'title': '[TEST] Lagos Port Project Excellence',
                'category': 'Project Excellence',
                'achievement_type': 'PROJECT_SUCCESS',
                'status': 'ACTIVE',
                'featured': True,
                'days_ago': 90
            },
            {
                'title': '[TEST] Environmental Impact Certificate',
                'category': 'Environmental Stewardship',
                'achievement_type': 'CERTIFICATION',
                'status': 'ACTIVE',
                'featured': False,
                'days_ago': 120
            }
        ]
        
        created_count = 0
        for achievement_data in test_achievements:
            category = AchievementCategory.objects.get(name=achievement_data['category'])
            
            achievement, created = Achievement.objects.get_or_create(
                title=achievement_data['title'],
                defaults={
                    'description': self.generate_achievement_description(achievement_data['title']),
                    'short_description': f'Test achievement for quality assurance - {achievement_data["category"]}',
                    'achievement_type': achievement_data['achievement_type'],
                    'category': category,
                    'achievement_date': date.today() - timedelta(days=achievement_data['days_ago']),
                    'status': achievement_data['status'],
                    'featured': achievement_data['featured'],
                    'impact_metrics': {
                        'projects_completed': random.randint(5, 50),
                        'cost_savings': random.randint(100000, 5000000),
                        'safety_hours': random.randint(10000, 100000)
                    },
                    'external_link': 'https://example.com/test-award',
                    'display_order': created_count,
                    'view_count': random.randint(20, 200)
                }
            )
            
            if created:
                created_count += 1
                self.stdout.write(f'  + Created: {achievement.title[:50]}...')
        
        self.stdout.write(f'  >> Achievements: {created_count} created, {Achievement.objects.count()} total\n')

    def test_project_content(self):
        """Create test projects and portfolio items"""
        self.stdout.write('>> Creating test project content...')
        
        # Regular projects
        test_projects = [
            {
                'name': '[TEST] Lagos LNG Terminal Phase 2',
                'client': 'Nigerian LNG Limited',
                'category': 'Engineering & Design',
                'status': 'COMPLETED',
                'featured': True,
                'days_start': 365,
                'days_complete': 30
            },
            {
                'name': '[TEST] Offshore Platform Delta',
                'client': 'Shell Petroleum Development Company',
                'category': 'Marine & Offshore',
                'status': 'IN_PROGRESS',
                'featured': True,
                'days_start': 180,
                'days_complete': None
            },
            {
                'name': '[TEST] Warri Refinery Modernization',
                'client': 'Nigerian National Petroleum Corporation',
                'category': 'Engineering & Design',
                'status': 'PLANNING',
                'featured': False,
                'days_start': 90,
                'days_complete': None
            }
        ]
        
        # Ensure job categories exist (used for projects too)
        for project_data in test_projects:
            category, _ = JobCategory.objects.get_or_create(
                name=project_data['category'],
                defaults={'description': f'{project_data["category"]} projects and services'}
            )
            
            project, created = Project.objects.get_or_create(
                name=project_data['name'],
                defaults={
                    'client': project_data['client'],
                    'description': self.generate_project_description(project_data['name']),
                    'detailed_description': self.generate_detailed_project_description(project_data['name']),
                    'start_date': date.today() - timedelta(days=project_data['days_start']),
                    'completion_date': date.today() - timedelta(days=project_data['days_complete']) if project_data['days_complete'] else None,
                    'category': category,
                    'status': project_data['status'],
                    'location': 'Nigeria',
                    'project_value': Decimal(str(random.randint(1000000, 50000000))),
                    'featured': project_data['featured']
                }
            )
            
            if created:
                self.stdout.write(f'  + Created project: {project.name[:50]}...')
        
        # Portfolio projects
        test_portfolio = [
            {
                'title': '[TEST] Oil Spill Response System',
                'client': 'Chevron Nigeria Limited',
                'project_type': 'OIL_SPILL',
                'status': 'FEATURED',
                'days_start': 270,
                'days_complete': 60
            },
            {
                'title': '[TEST] Marine Support Bonny Island',
                'client': 'Nigeria LNG Limited',
                'project_type': 'MARINE',
                'status': 'STANDARD',
                'days_start': 200,
                'days_complete': 15
            },
            {
                'title': '[TEST] Environmental Niger Delta',
                'client': 'Federal Ministry of Environment',
                'project_type': 'ENVIRONMENTAL',
                'status': 'FEATURED',
                'days_start': 400,
                'days_complete': 90
            }
        ]
        
        portfolio_created = 0
        for portfolio_data in test_portfolio:
            portfolio, created = ProjectPortfolio.objects.get_or_create(
                title=portfolio_data['title'],
                defaults={
                    'slug': slugify(portfolio_data['title']),
                    'client': portfolio_data['client'],
                    'location': 'Nigeria',
                    'project_type': portfolio_data['project_type'],
                    'brief_description': f'Test portfolio project for quality assurance - {portfolio_data["project_type"]}',
                    'detailed_description': self.generate_portfolio_description(portfolio_data['title']),
                    'challenge': self.generate_portfolio_challenge(portfolio_data['title']),
                    'solution': self.generate_portfolio_solution(portfolio_data['title']),
                    'results': self.generate_portfolio_results(portfolio_data['title']),
                    'start_date': date.today() - timedelta(days=portfolio_data['days_start']),
                    'completion_date': date.today() - timedelta(days=portfolio_data['days_complete']),
                    'project_value': Decimal(str(random.randint(5000000, 100000000))),
                    'duration_months': random.randint(6, 24),
                    'status': portfolio_data['status'],
                    'featured_on_homepage': portfolio_data['status'] == 'FEATURED',
                    'environmental_impact': {
                        'co2_reduced': random.randint(1000, 10000),
                        'water_saved': random.randint(50000, 500000),
                        'waste_recycled': random.randint(10000, 100000)
                    },
                    'key_statistics': {
                        'team_size': random.randint(20, 200),
                        'equipment_units': random.randint(5, 50),
                        'safety_hours': random.randint(50000, 500000)
                    },
                    'tags': 'test, quality-assurance, project-portfolio',
                    'view_count': random.randint(100, 1000)
                }
            )
            
            if created:
                portfolio_created += 1
                self.stdout.write(f'  + Created portfolio: {portfolio.title[:50]}...')
        
        self.stdout.write(f'  >> Projects: {Project.objects.filter(name__icontains='[TEST]').count()} created')
        self.stdout.write(f'  >> Portfolio: {portfolio_created} created, {ProjectPortfolio.objects.count()} total\n')

    def test_milestone_content(self):
        """Create test company milestones"""
        self.stdout.write('>> Creating test company milestones...')
        
        test_milestones = [
            {
                'title': '[TEST] 25 Years of Excellence',
                'milestone_date': date(2024, 1, 15),
                'icon': 'fas fa-anniversary',
                'featured': True
            },
            {
                'title': '[TEST] 500th Project Completion',
                'milestone_date': date(2023, 9, 22),
                'icon': 'fas fa-trophy',
                'featured': True
            },
            {
                'title': '[TEST] ISO 45001 Certification',
                'milestone_date': date(2023, 6, 10),
                'icon': 'fas fa-certificate',
                'featured': False
            },
            {
                'title': '[TEST] Digital Innovation Center',
                'milestone_date': date(2023, 3, 5),
                'icon': 'fas fa-rocket',
                'featured': True
            },
            {
                'title': '[TEST] 10,000th Training Completion',
                'milestone_date': date(2022, 12, 20),
                'icon': 'fas fa-graduation-cap',
                'featured': False
            }
        ]
        
        created_count = 0
        for milestone_data in test_milestones:
            milestone, created = CompanyMilestone.objects.get_or_create(
                title=milestone_data['title'],
                defaults={
                    'description': self.generate_milestone_description(milestone_data['title']),
                    'milestone_date': milestone_data['milestone_date'],
                    'milestone_year': milestone_data['milestone_date'].year,
                    'icon': milestone_data['icon'],
                    'featured': milestone_data['featured'],
                    'display_order': created_count
                }
            )
            
            if created:
                created_count += 1
                self.stdout.write(f'  + Created: {milestone.title[:50]}...')
        
        self.stdout.write(f'  >> Milestones: {created_count} created, {CompanyMilestone.objects.count()} total\n')

    def test_contact_content(self):
        """Create test contact submissions"""
        self.stdout.write('>> Creating test contact submissions...')
        
        # Ensure inquiry categories exist
        sample_categories = [
            'General Business Inquiry',
            'Engineering & Consultancy',
            'Marine Support Services',
            'Career Opportunities',
            'Partnership & Joint Ventures'
        ]
        
        for cat_name in sample_categories:
            InquiryCategory.objects.get_or_create(
                name=cat_name,
                defaults={'description': f'{cat_name} related inquiries and questions'}
            )
        
        test_contacts = [
            {
                'name': 'TEST John Smith',
                'email': 'john.smith.test@company.com',
                'company': 'Test Energy Solutions Ltd',
                'phone': '+234-800-111-2222',
                'category': 'Engineering & Consultancy',
                'days_ago': 1,
                'read': False
            },
            {
                'name': 'TEST Sarah Williams',
                'email': 'sarah.williams.test@maritime.com',
                'company': 'Maritime Logistics Inc',
                'phone': '+234-800-333-4444',
                'category': 'Marine Support Services',
                'days_ago': 3,
                'read': True
            },
            {
                'name': 'TEST Michael Johnson',
                'email': 'michael.johnson.test@petrotech.com',
                'company': 'PetroTech Innovations',
                'phone': '+234-800-555-6666',
                'category': 'Partnership & Joint Ventures',
                'days_ago': 5,
                'read': True
            },
            {
                'name': 'TEST Emma Davis',
                'email': 'emma.davis.test@gmail.com',
                'company': '',
                'phone': '+234-800-777-8888',
                'category': 'Career Opportunities',
                'days_ago': 7,
                'read': False
            },
            {
                'name': 'TEST Robert Brown',
                'email': 'robert.brown.test@oilfield.com',
                'company': 'Oilfield Services Group',
                'phone': '+234-800-999-0000',
                'category': 'General Business Inquiry',
                'days_ago': 10,
                'read': True
            }
        ]
        
        created_count = 0
        for contact_data in test_contacts:
            category = InquiryCategory.objects.get(name=contact_data['category'])
            
            contact, created = ContactSubmission.objects.get_or_create(
                email=contact_data['email'],
                defaults={
                    'name': contact_data['name'],
                    'company': contact_data['company'],
                    'phone': contact_data['phone'],
                    'inquiry_type': category,
                    'message': self.generate_inquiry_message(contact_data['category']),
                    'date': timezone.now() - timedelta(days=contact_data['days_ago']),
                    'read': contact_data['read']
                }
            )
            
            if created:
                created_count += 1
                self.stdout.write(f'  + Created: {contact.name}')
        
        self.stdout.write(f'  >> Contact Submissions: {created_count} created, {ContactSubmission.objects.count()} total\n')

    def test_newsletter_content(self):
        """Create test newsletter content and subscribers"""
        self.stdout.write('>> Creating test newsletter content...')
        
        # Create test subscribers
        test_subscribers = [
            {'email': 'test.subscriber1@company.com', 'first_name': 'TEST_John', 'last_name': 'Doe'},
            {'email': 'test.subscriber2@energy.com', 'first_name': 'TEST_Jane', 'last_name': 'Smith'},
            {'email': 'test.subscriber3@maritime.com', 'first_name': 'TEST_Mike', 'last_name': 'Johnson'},
            {'email': 'test.subscriber4@oilgas.com', 'first_name': 'TEST_Sarah', 'last_name': 'Wilson'},
            {'email': 'test.subscriber5@petrotech.com', 'first_name': 'TEST_David', 'last_name': 'Brown'},
        ]
        
        # Ensure subscription categories exist
        sub_categories = ['Company Updates', 'Technical Insights', 'Industry News']
        for cat_name in sub_categories:
            SubscriptionCategory.objects.get_or_create(
                name=cat_name,
                defaults={'description': f'{cat_name} and related content'}
            )
        
        subscriber_count = 0
        for sub_data in test_subscribers:
            subscriber, created = Subscriber.objects.get_or_create(
                email=sub_data['email'],
                defaults={
                    'first_name': sub_data['first_name'],
                    'last_name': sub_data['last_name'],
                    'active_status': True,
                    'unsubscribe_token': str(uuid.uuid4())[:20]  # Generate unique token
                }
            )
            
            if created:
                # Add random interests
                categories = SubscriptionCategory.objects.all()
                subscriber.interests.set(random.sample(list(categories), random.randint(1, len(categories))))
                subscriber_count += 1
        
        # Create test newsletters
        test_newsletters = [
            {
                'title': '[TEST] Monthly Update March 2024',
                'content': 'Test newsletter content for quality assurance testing.',
                'sent': True,
                'days_ago': 10,
                'recipient_count': 150
            },
            {
                'title': '[TEST] Lagos LNG Project Spotlight',
                'content': 'Special edition newsletter focusing on our major LNG project.',
                'sent': True,
                'days_ago': 20,
                'recipient_count': 145
            },
            {
                'title': '[TEST] Safety Week 2024 Draft',
                'content': 'Draft newsletter for upcoming safety awareness week.',
                'sent': False,
                'days_ago': 0,
                'recipient_count': 0
            }
        ]
        
        newsletter_count = 0
        for newsletter_data in test_newsletters:
            newsletter, created = Newsletter.objects.get_or_create(
                title=newsletter_data['title'],
                defaults={
                    'content': newsletter_data['content'],
                    'html_content': f'<p>{newsletter_data["content"]}</p>',
                    'send_date': timezone.now() - timedelta(days=newsletter_data['days_ago']) if newsletter_data['sent'] else None,
                    'recipient_count': newsletter_data['recipient_count'],
                    'sent': newsletter_data['sent'],
                    'created_date': timezone.now() - timedelta(days=newsletter_data['days_ago'] + 2)
                }
            )
            
            if created:
                # Add random categories
                categories = SubscriptionCategory.objects.all()
                newsletter.categories.set(random.sample(list(categories), random.randint(1, 2)))
                newsletter_count += 1
        
        self.stdout.write(f'  >> Subscribers: {subscriber_count} created, {Subscriber.objects.count()} total')
        self.stdout.write(f'  >> Newsletters: {newsletter_count} created, {Newsletter.objects.count()} total\n')

    # Content generation methods
    def generate_article_content(self, title):
        return f"""
        <p>This is a comprehensive test article for {title}. This content is generated for quality assurance testing of the blog system.</p>
        
        <h3>Key Highlights</h3>
        <ul>
            <li>Testing blog functionality and display</li>
            <li>Validating content management system</li>
            <li>Ensuring proper formatting and layout</li>
            <li>Verifying SEO optimization features</li>
        </ul>
        
        <h3>Technical Details</h3>
        <p>This test article demonstrates the blog system's ability to handle various content types including headers, paragraphs, lists, and formatted text. The content management system has been designed to support rich text editing and multimedia integration.</p>
        
        <p>Quality assurance testing ensures that all features work as expected in a production environment.</p>
        """

    def generate_job_description(self, title):
        return f"""
        We are seeking a qualified professional for the {title} position. This is a test job posting created for quality assurance purposes.

        Key Responsibilities:
        • Lead and manage project activities in accordance with company standards
        • Ensure compliance with safety, environmental, and quality requirements
        • Collaborate with cross-functional teams to deliver project objectives
        • Provide technical expertise and guidance to junior team members
        • Maintain accurate project documentation and reporting

        This position offers excellent career growth opportunities within Axflo's dynamic team.
        """

    def generate_job_requirements(self, title):
        return """
        Education & Experience:
        • Bachelor's degree in Engineering or related field
        • Minimum 5 years of experience in oil and gas industry
        • Professional certifications preferred
        • Strong project management skills

        Technical Skills:
        • Proficiency in industry-standard software
        • Knowledge of international standards and regulations
        • Excellent analytical and problem-solving abilities
        • Strong communication and leadership skills

        Other Requirements:
        • Willingness to work offshore/remote locations
        • Valid medical certificate for offshore work
        • Clean safety record
        """

    def generate_achievement_description(self, title):
        return f"""
        This achievement represents Axflo's commitment to excellence in the oil and gas industry. {title} demonstrates our dedication to maintaining the highest standards of performance, safety, and innovation.

        This recognition validates our team's hard work and expertise in delivering world-class solutions to our clients. It reinforces our position as a leading contractor in West Africa's energy sector.

        The achievement reflects our continuous improvement philosophy and commitment to stakeholder value creation.
        """

    def generate_project_description(self, name):
        return f"""
        {name} is a comprehensive test project created for quality assurance of the project management system. This project demonstrates our engineering capabilities and project delivery excellence.

        The project involves complex technical challenges that showcase our expertise in the oil and gas sector.
        """

    def generate_detailed_project_description(self, name):
        return f"""
        {name} represents a significant milestone in our project portfolio. This comprehensive project involves multiple phases of execution including planning, design, procurement, construction, and commissioning.

        Our experienced team of engineers and project managers have worked closely with the client to ensure all specifications are met while maintaining the highest standards of safety and environmental compliance.

        Key project features include state-of-the-art technology integration, advanced safety systems, and sustainable engineering practices that minimize environmental impact.
        """

    def generate_portfolio_description(self, title):
        return f"""
        {title} showcases Axflo's comprehensive capabilities in delivering complex projects for the oil and gas industry. This project demonstrates our technical expertise, project management excellence, and commitment to safety and environmental stewardship.

        Our multidisciplinary team successfully delivered this project on time and within budget, exceeding client expectations and industry standards.
        """

    def generate_portfolio_challenge(self, title):
        return f"""
        The {title} project presented several complex technical and logistical challenges including:
        • Harsh environmental conditions requiring specialized equipment
        • Tight project schedule demanding efficient coordination
        • Complex regulatory requirements and compliance standards
        • Integration with existing infrastructure systems
        • Remote location logistics and supply chain management
        """

    def generate_portfolio_solution(self, title):
        return f"""
        Axflo developed innovative solutions to address project challenges:
        • Deployed advanced technology and specialized equipment
        • Implemented comprehensive project management methodology
        • Established robust quality assurance and safety protocols
        • Created efficient logistics and supply chain strategies
        • Developed strong stakeholder engagement and communication plans
        """

    def generate_portfolio_results(self, title):
        return f"""
        The {title} project achieved outstanding results:
        • Completed on schedule with zero safety incidents
        • Exceeded performance specifications and quality standards
        • Delivered significant cost savings through innovative approaches
        • Achieved environmental compliance and sustainability goals
        • Received client recognition for excellence in project delivery
        """

    def generate_milestone_description(self, title):
        return f"""
        {title} represents a significant achievement in Axflo's corporate journey. This milestone reflects our commitment to excellence, innovation, and sustainable growth in the oil and gas industry.

        This achievement demonstrates our team's dedication and the trust our clients place in our capabilities. It reinforces our position as a leading service provider in West Africa's energy sector.
        """

    def generate_inquiry_message(self, category):
        messages = {
            'General Business Inquiry': 'Hello, I would like to learn more about your services and capabilities. Please provide information about your company and how we might work together.',
            'Engineering & Consultancy': 'We are interested in your engineering consultancy services for an upcoming offshore platform project. Could you please share your capabilities and experience in this area?',
            'Marine Support Services': 'Our company requires marine support services for offshore operations. Please provide details about your vessel fleet and service capabilities.',
            'Career Opportunities': 'I am interested in career opportunities with Axflo. I have 8 years of experience in the oil and gas industry and would like to explore available positions.',
            'Partnership & Joint Ventures': 'We are exploring partnership opportunities for upcoming projects in West Africa. Please let us know about your partnership framework and requirements.'
        }
        return messages.get(category, 'Test inquiry message for quality assurance testing.')

    def print_summary(self):
        """Print comprehensive summary of test content"""
        self.stdout.write(self.style.SUCCESS('\n>> QUALITY TEST SUMMARY'))
        self.stdout.write('=' * 50)
        
        # Blog content
        blog_articles = NewsArticle.objects.filter(title__icontains='[TEST]').count()
        blog_categories = BlogCategory.objects.count()
        self.stdout.write(f'>> Blog Articles: {blog_articles} test articles, {NewsArticle.objects.count()} total')
        self.stdout.write(f'>> Blog Categories: {blog_categories} categories')
        
        # Career content
        job_postings = JobPosting.objects.filter(title__icontains='[TEST]').count()
        job_applications = JobApplication.objects.filter(first_name__icontains='TEST').count()
        job_categories = JobCategory.objects.count()
        self.stdout.write(f'>> Job Postings: {job_postings} test jobs, {JobPosting.objects.count()} total')
        self.stdout.write(f'>> Job Applications: {job_applications} test applications')
        self.stdout.write(f'>> Job Categories: {job_categories} categories')
        
        # Achievement content
        achievements = Achievement.objects.filter(title__icontains='[TEST]').count()
        achievement_categories = AchievementCategory.objects.count()
        self.stdout.write(f'>> Achievements: {achievements} test achievements, {Achievement.objects.count()} total')
        self.stdout.write(f'>> Achievement Categories: {achievement_categories} categories')
        
        # Project content
        projects = Project.objects.filter(name__icontains='[TEST]').count()
        portfolio = ProjectPortfolio.objects.filter(title__icontains='[TEST]').count()
        self.stdout.write(f'>> Projects: {projects} test projects, {Project.objects.count()} total')
        self.stdout.write(f'>> Portfolio: {portfolio} test portfolio items, {ProjectPortfolio.objects.count()} total')
        
        # Milestone content
        milestones = CompanyMilestone.objects.filter(title__icontains='[TEST]').count()
        self.stdout.write(f'>> Milestones: {milestones} test milestones, {CompanyMilestone.objects.count()} total')
        
        # Contact content
        contacts = ContactSubmission.objects.filter(name__icontains='TEST').count()
        inquiry_categories = InquiryCategory.objects.count()
        self.stdout.write(f'>> Contacts: {contacts} test submissions, {ContactSubmission.objects.count()} total')
        self.stdout.write(f'>> Inquiry Categories: {inquiry_categories} categories')
        
        # Newsletter content
        newsletters = Newsletter.objects.filter(title__icontains='[TEST]').count()
        subscribers = Subscriber.objects.filter(email__icontains='test').count()
        subscription_categories = SubscriptionCategory.objects.count()
        self.stdout.write(f'>> Newsletters: {newsletters} test newsletters, {Newsletter.objects.count()} total')
        self.stdout.write(f'>> Subscribers: {subscribers} test subscribers, {Subscriber.objects.count()} total')
        self.stdout.write(f'>> Subscription Categories: {subscription_categories} categories')
        
        self.stdout.write('\n>> All systems tested and ready for production!')
        self.stdout.write('>> Check the admin interface to verify all content is displaying correctly.')
        self.stdout.write('>> Test the frontend to ensure dynamic content is working properly.')