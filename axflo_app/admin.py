from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import (
    NewsArticle, Service, CSRProject, InquiryCategory, ContactSubmission, 
    ContactResponse, JobCategory, JobPosting, JobApplication, 
    SubscriptionCategory, Subscriber, Newsletter, PageContent, 
    ServiceDescription, CompanyInfo, Project, ProjectImage, ClientTestimonial,
    AchievementCategory, Achievement, ProjectPortfolio, CompanyMilestone
)

# ================================
# CONTACT ADMIN
# ================================

@admin.register(InquiryCategory)
class InquiryCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name', 'description']
    ordering = ['name']

@admin.register(ContactSubmission)
class ContactSubmissionAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'company', 'inquiry_type', 'date', 'read_status', 'view_response']
    list_filter = ['read', 'inquiry_type', 'date']
    search_fields = ['name', 'email', 'company', 'message']
    readonly_fields = ['date']
    ordering = ['-date']
    list_per_page = 25
    
    fieldsets = (
        ('Contact Information', {
            'fields': ('name', 'email', 'company', 'phone')
        }),
        ('Inquiry Details', {
            'fields': ('inquiry_type', 'message', 'date', 'read')
        }),
    )
    
    def read_status(self, obj):
        if obj.read:
            return format_html(
                '<span style="color: green; font-weight: bold;">✓ Read</span>'
            )
        else:
            return format_html(
                '<span style="color: red; font-weight: bold;">✗ Unread</span>'
            )
    read_status.short_description = 'Status'
    
    def view_response(self, obj):
        response_count = obj.contactresponse_set.count()
        if response_count > 0:
            return format_html(
                '<a href="{}?contact_submission__id__exact={}" style="color: blue;">View {} Response(s)</a>',
                reverse('admin:axflo_app_contactresponse_changelist'),
                obj.id,
                response_count
            )
        else:
            return format_html(
                '<a href="{}?contact_submission={}" style="color: green;">Add Response</a>',
                reverse('admin:axflo_app_contactresponse_add'),
                obj.id
            )
    view_response.short_description = 'Responses'
    
    def save_model(self, request, obj, form, change):
        # Mark as read when admin views/saves the submission
        if change and not obj.read:
            obj.read = True
        super().save_model(request, obj, form, change)
    
    actions = ['mark_as_read', 'mark_as_unread']
    
    def mark_as_read(self, request, queryset):
        updated = queryset.update(read=True)
        self.message_user(request, f'{updated} submissions marked as read.')
    mark_as_read.short_description = 'Mark selected submissions as read'
    
    def mark_as_unread(self, request, queryset):
        updated = queryset.update(read=False)
        self.message_user(request, f'{updated} submissions marked as unread.')
    mark_as_unread.short_description = 'Mark selected submissions as unread'

@admin.register(ContactResponse)
class ContactResponseAdmin(admin.ModelAdmin):
    list_display = ['contact_submission', 'staff_member', 'response_date', 'short_response']
    list_filter = ['response_date', 'staff_member']
    search_fields = ['contact_submission__name', 'contact_submission__email', 'response_text']
    readonly_fields = ['response_date']
    ordering = ['-response_date']
    
    fieldsets = (
        ('Contact Details', {
            'fields': ('contact_submission',)
        }),
        ('Response', {
            'fields': ('response_text', 'staff_member', 'response_date')
        }),
    )
    
    def short_response(self, obj):
        return obj.response_text[:100] + '...' if len(obj.response_text) > 100 else obj.response_text
    short_response.short_description = 'Response Preview'
    
    def save_model(self, request, obj, form, change):
        if not change:  # If creating new response
            obj.staff_member = request.user
        super().save_model(request, obj, form, change)

# ================================
# EXISTING MODEL ADMIN (keeping existing functionality)
# ================================

@admin.register(NewsArticle)
class NewsArticleAdmin(admin.ModelAdmin):
    list_display = ['title', 'created_at', 'updated_at']
    list_filter = ['created_at', 'updated_at']
    search_fields = ['title', 'content']
    ordering = ['-created_at']

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ['name', 'icon']
    search_fields = ['name', 'description']
    ordering = ['name']

@admin.register(CSRProject)
class CSRProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'start_date', 'end_date']
    list_filter = ['category', 'start_date']
    search_fields = ['title', 'description']
    ordering = ['-start_date']

# ================================
# CAREER ADMIN
# ================================

@admin.register(JobCategory)
class JobCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'description']
    search_fields = ['name', 'description']
    ordering = ['name']

@admin.register(JobPosting)
class JobPostingAdmin(admin.ModelAdmin):
    list_display = ['title', 'department', 'employment_type', 'status', 'posted_date', 'closing_date']
    list_filter = ['employment_type', 'status', 'department', 'posted_date']
    search_fields = ['title', 'description', 'location']
    ordering = ['-posted_date']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'department', 'location', 'employment_type')
        }),
        ('Job Details', {
            'fields': ('description', 'requirements', 'salary_range')
        }),
        ('Status & Dates', {
            'fields': ('status', 'closing_date')
        }),
    )

@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'job_posting', 'email', 'status', 'application_date']
    list_filter = ['status', 'application_date', 'job_posting']
    search_fields = ['first_name', 'last_name', 'email', 'job_posting__title']
    readonly_fields = ['application_date']
    ordering = ['-application_date']
    
    def full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"
    full_name.short_description = 'Full Name'
    
    fieldsets = (
        ('Personal Information', {
            'fields': ('first_name', 'last_name', 'email', 'phone', 'address')
        }),
        ('Application Details', {
            'fields': ('job_posting', 'resume', 'cover_letter', 'application_date')
        }),
        ('Status & Notes', {
            'fields': ('status', 'notes')
        }),
    )

# ================================
# NEWSLETTER ADMIN
# ================================

@admin.register(SubscriptionCategory)
class SubscriptionCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'description']
    search_fields = ['name', 'description']
    ordering = ['name']

@admin.register(Subscriber)
class SubscriberAdmin(admin.ModelAdmin):
    list_display = ['email', 'full_name', 'subscription_date', 'active_status']
    list_filter = ['active_status', 'subscription_date', 'interests']
    search_fields = ['email', 'first_name', 'last_name']
    ordering = ['-subscription_date']
    
    def full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip() or "N/A"
    full_name.short_description = 'Full Name'

@admin.register(Newsletter)
class NewsletterAdmin(admin.ModelAdmin):
    list_display = ['title', 'sent', 'send_date', 'recipient_count', 'created_date']
    list_filter = ['sent', 'send_date', 'created_date', 'categories']
    search_fields = ['title', 'content']
    ordering = ['-created_date']

# ================================
# CONTENT ADMIN
# ================================

@admin.register(PageContent)
class PageContentAdmin(admin.ModelAdmin):
    list_display = ['page_name', 'section', 'last_updated', 'updated_by']
    list_filter = ['page_name', 'last_updated']
    search_fields = ['page_name', 'section', 'content']
    ordering = ['page_name', 'section']

@admin.register(ServiceDescription)
class ServiceDescriptionAdmin(admin.ModelAdmin):
    list_display = ['service_name', 'slug', 'active', 'order', 'created_at']
    list_filter = ['active', 'created_at']
    search_fields = ['service_name', 'description', 'features']
    ordering = ['order', 'service_name']
    prepopulated_fields = {'slug': ('service_name',)}

@admin.register(CompanyInfo)
class CompanyInfoAdmin(admin.ModelAdmin):
    list_display = ['__str__', 'founded_year', 'employee_count', 'last_updated']
    
    def has_add_permission(self, request):
        # Only allow one instance of company info
        return not CompanyInfo.objects.exists()

# ================================
# PROJECT ADMIN
# ================================

class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 1
    fields = ['image', 'caption', 'display_order', 'is_featured']

class ClientTestimonialInline(admin.TabularInline):
    model = ClientTestimonial
    extra = 0
    fields = ['client_name', 'client_position', 'client_company', 'testimonial', 'rating', 'approved']

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['name', 'client', 'status', 'start_date', 'completion_date', 'featured']
    list_filter = ['status', 'category', 'featured', 'start_date']
    search_fields = ['name', 'client', 'description']
    ordering = ['-completion_date', '-start_date']
    inlines = [ProjectImageInline, ClientTestimonialInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'client', 'category', 'location')
        }),
        ('Project Details', {
            'fields': ('description', 'detailed_description', 'project_value')
        }),
        ('Timeline & Status', {
            'fields': ('start_date', 'completion_date', 'status', 'featured')
        }),
    )

@admin.register(ClientTestimonial)
class ClientTestimonialAdmin(admin.ModelAdmin):
    list_display = ['client_name', 'client_company', 'project', 'rating', 'approved', 'date_given']
    list_filter = ['approved', 'rating', 'date_given', 'project']
    search_fields = ['client_name', 'client_company', 'testimonial', 'project__name']
    ordering = ['-date_given']

# ================================
# ACHIEVEMENTS ADMIN
# ================================

@admin.register(AchievementCategory)
class AchievementCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'icon', 'color_preview']
    search_fields = ['name', 'description']
    ordering = ['name']
    
    def color_preview(self, obj):
        return format_html(
            '<div style="width: 30px; height: 20px; background-color: {}; border: 1px solid #ccc; border-radius: 3px;"></div>',
            obj.color
        )
    color_preview.short_description = 'Color Preview'

@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ['title', 'achievement_type', 'category', 'achievement_date', 'status', 'featured', 'view_count']
    list_filter = ['achievement_type', 'status', 'featured', 'category', 'achievement_date']
    search_fields = ['title', 'description', 'short_description']
    ordering = ['-achievement_date', 'display_order']
    readonly_fields = ['view_count', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'achievement_type', 'category', 'achievement_date')
        }),
        ('Content', {
            'fields': ('short_description', 'description', 'featured_image')
        }),
        ('Metadata', {
            'fields': ('impact_metrics', 'external_link', 'gallery_images')
        }),
        ('Display Settings', {
            'fields': ('status', 'featured', 'display_order')
        }),
        ('Analytics', {
            'fields': ('view_count', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['mark_as_featured', 'mark_as_not_featured', 'mark_as_active', 'mark_as_archived']
    
    def mark_as_featured(self, request, queryset):
        updated = queryset.update(featured=True)
        self.message_user(request, f'{updated} achievements marked as featured.')
    mark_as_featured.short_description = 'Mark selected achievements as featured'
    
    def mark_as_not_featured(self, request, queryset):
        updated = queryset.update(featured=False)
        self.message_user(request, f'{updated} achievements unmarked as featured.')
    mark_as_not_featured.short_description = 'Unmark selected achievements as featured'
    
    def mark_as_active(self, request, queryset):
        updated = queryset.update(status='ACTIVE')
        self.message_user(request, f'{updated} achievements marked as active.')
    mark_as_active.short_description = 'Mark selected achievements as active'
    
    def mark_as_archived(self, request, queryset):
        updated = queryset.update(status='ARCHIVED')
        self.message_user(request, f'{updated} achievements archived.')
    mark_as_archived.short_description = 'Archive selected achievements'

@admin.register(ProjectPortfolio)
class ProjectPortfolioAdmin(admin.ModelAdmin):
    list_display = ['title', 'client', 'project_type', 'location', 'status', 'completion_date', 'featured_on_homepage', 'view_count']
    list_filter = ['project_type', 'status', 'featured_on_homepage', 'completion_date', 'start_date']
    search_fields = ['title', 'client', 'location', 'brief_description', 'tags']
    ordering = ['-completion_date', 'display_order']
    readonly_fields = ['slug', 'view_count', 'created_at', 'updated_at']
    prepopulated_fields = {'slug': ('title',)}
    
    fieldsets = (
        ('Project Overview', {
            'fields': ('title', 'slug', 'client', 'location', 'project_type')
        }),
        ('Project Description', {
            'fields': ('brief_description', 'detailed_description', 'challenge', 'solution', 'results')
        }),
        ('Project Timeline & Value', {
            'fields': ('start_date', 'completion_date', 'duration_months', 'project_value')
        }),
        ('Media', {
            'fields': ('featured_image', 'before_image', 'after_image', 'gallery_images')
        }),
        ('Metrics & Impact', {
            'fields': ('environmental_impact', 'key_statistics')
        }),
        ('Display & SEO', {
            'fields': ('status', 'featured_on_homepage', 'display_order', 'meta_description', 'tags')
        }),
        ('Analytics', {
            'fields': ('view_count', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['mark_as_featured', 'mark_as_not_featured', 'mark_as_archived', 'mark_as_standard']
    
    def mark_as_featured(self, request, queryset):
        updated = queryset.update(status='FEATURED', featured_on_homepage=True)
        self.message_user(request, f'{updated} projects marked as featured.')
    mark_as_featured.short_description = 'Mark selected projects as featured'
    
    def mark_as_not_featured(self, request, queryset):
        updated = queryset.update(featured_on_homepage=False)
        self.message_user(request, f'{updated} projects unmarked from homepage.')
    mark_as_not_featured.short_description = 'Remove from homepage'
    
    def mark_as_archived(self, request, queryset):
        updated = queryset.update(status='ARCHIVED')
        self.message_user(request, f'{updated} projects archived.')
    mark_as_archived.short_description = 'Archive selected projects'
    
    def mark_as_standard(self, request, queryset):
        updated = queryset.update(status='STANDARD')
        self.message_user(request, f'{updated} projects marked as standard.')
    mark_as_standard.short_description = 'Mark as standard projects'

@admin.register(CompanyMilestone)
class CompanyMilestoneAdmin(admin.ModelAdmin):
    list_display = ['title', 'milestone_year', 'milestone_date', 'featured', 'display_order']
    list_filter = ['featured', 'milestone_year', 'milestone_date']
    search_fields = ['title', 'description']
    ordering = ['-milestone_date', 'display_order']
    
    fieldsets = (
        ('Milestone Information', {
            'fields': ('title', 'description', 'milestone_date')
        }),
        ('Display Settings', {
            'fields': ('icon', 'image', 'featured', 'display_order')
        }),
    )
    
    actions = ['mark_as_featured', 'mark_as_not_featured']
    
    def mark_as_featured(self, request, queryset):
        updated = queryset.update(featured=True)
        self.message_user(request, f'{updated} milestones marked as featured.')
    mark_as_featured.short_description = 'Mark selected milestones as featured'
    
    def mark_as_not_featured(self, request, queryset):
        updated = queryset.update(featured=False)
        self.message_user(request, f'{updated} milestones unmarked as featured.')
    mark_as_not_featured.short_description = 'Unmark selected milestones as featured'

# ================================
# USER ADMIN - Enable user deletion
# ================================

class CustomUserAdmin(UserAdmin):
    """Custom User admin with deletion permissions and self-management capabilities"""
    
    # Use custom templates
    change_form_template = 'admin/auth/user/change_form.html'
    change_list_template = 'admin/auth/user/change_list.html'
    
    def has_delete_permission(self, request, obj=None):
        # Superusers can delete any user
        if request.user.is_superuser:
            return True
        # Users can delete their own account
        if obj and obj == request.user:
            return True
        return False
    
    def has_change_permission(self, request, obj=None):
        # Superusers can change any user
        if request.user.is_superuser:
            return True
        # Users can change their own account
        if obj and obj == request.user:
            return True
        # Staff users can change their own account when obj is None (list view)
        if obj is None and request.user.is_staff:
            return True
        return False
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        # Superusers see all users
        if request.user.is_superuser:
            return qs
        # Non-superuser staff only see themselves
        return qs.filter(id=request.user.id)
    
    def get_fieldsets(self, request, obj=None):
        """Customize fieldsets based on user permissions"""
        if not request.user.is_superuser and obj and obj == request.user:
            # Non-superuser editing their own profile - simplified fieldsets
            return (
                (None, {'fields': ('username', 'password')}),
                ('Personal info', {'fields': ('first_name', 'last_name', 'email')}),
                ('Important dates', {'fields': ('last_login', 'date_joined'), 'classes': ('collapse',)}),
            )
        else:
            # Superuser or default view
            return super().get_fieldsets(request, obj)
    
    def get_readonly_fields(self, request, obj=None):
        """Make certain fields readonly for non-superusers"""
        readonly_fields = list(super().get_readonly_fields(request, obj))
        
        if not request.user.is_superuser and obj and obj == request.user:
            # Non-superuser editing their own profile
            readonly_fields.extend(['date_joined', 'last_login'])
        
        return readonly_fields
    
    actions = ['delete_selected']
    
    def delete_selected(self, request, queryset):
        """Custom delete action with additional checks"""
        if not request.user.is_superuser:
            # Non-superusers can only delete themselves
            queryset = queryset.filter(id=request.user.id)
        
        if queryset.filter(id=request.user.id).exists() and queryset.count() == 1:
            # User is deleting their own account
            from django.contrib import messages
            messages.warning(request, 
                'You are about to delete your own account. You will be logged out immediately.')
        
        return super().delete_model(request, queryset)
    
    delete_selected.short_description = "Delete selected users"

# Unregister the default User admin and register our custom one
admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)

# Admin site customization
admin.site.site_header = "Axflo Oil & Gas Administration"
admin.site.site_title = "Axflo Admin"
admin.site.index_title = "Welcome to Axflo Administration Portal"