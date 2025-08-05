from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

# Create your models here.

# ================================
# EXISTING MODELS (PRESERVED)
# ================================

class BlogCategory(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    slug = models.SlugField(unique=True)
    
    class Meta:
        verbose_name_plural = "Blog Categories"
        ordering = ['name']
    
    def __str__(self):
        return self.name

class NewsArticle(models.Model):
    STATUS_CHOICES = [
        ('DRAFT', 'Draft'),
        ('PUBLISHED', 'Published'),
        ('ARCHIVED', 'Archived'),
    ]
    
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    excerpt = models.TextField(max_length=300, blank=True, null=True, help_text="Brief description for preview")
    content = models.TextField()
    
    # Image options - can be upload or URL
    image = models.ImageField(upload_to='news/', blank=True, null=True, help_text="Upload image file")
    image_url = models.URLField(blank=True, null=True, help_text="Or provide image URL")
    image_alt = models.CharField(max_length=200, blank=True, help_text="Alternative text for image")
    
    # Additional fields
    category = models.ForeignKey(BlogCategory, on_delete=models.SET_NULL, null=True, blank=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    tags = models.CharField(max_length=200, blank=True, help_text="Comma-separated tags")
    
    # SEO fields
    meta_description = models.CharField(max_length=160, blank=True, help_text="SEO meta description")
    
    # Status and dates
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='DRAFT')
    featured = models.BooleanField(default=False, help_text="Feature this article on homepage")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True)
    
    # View count
    view_count = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = "News Article"
        verbose_name_plural = "News Articles"
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if not self.slug:
            from django.utils.text import slugify
            self.slug = slugify(self.title)
        
        # Set published_at when status changes to PUBLISHED
        if self.status == 'PUBLISHED' and not self.published_at:
            from django.utils import timezone
            self.published_at = timezone.now()
        
        super().save(*args, **kwargs)
    
    def get_image_url(self):
        """Return image URL, prioritizing uploaded image over URL"""
        if self.image:
            return self.image.url
        elif self.image_url:
            return self.image_url
        return None
    
    def get_tags_list(self):
        """Return tags as a list"""
        if self.tags:
            return [tag.strip() for tag in self.tags.split(',')]
        return []

class Service(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.CharField(max_length=50)  # Font Awesome icon class
    image = models.ImageField(upload_to='services/', blank=True)
    
    def __str__(self):
        return self.name

class CSRProject(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=50)
    image = models.ImageField(upload_to='csr/', blank=True)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    
    def __str__(self):
        return self.title


# ================================
# A. CONTACT MODELS
# ================================

class InquiryCategory(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name_plural = "Inquiry Categories"
    
    def __str__(self):
        return self.name

class ContactSubmission(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField()
    company = models.CharField(max_length=200, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    inquiry_type = models.ForeignKey(InquiryCategory, on_delete=models.CASCADE)
    message = models.TextField()
    date = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-date']
    
    def __str__(self):
        return f"{self.name} - {self.inquiry_type.name}"

class ContactResponse(models.Model):
    contact_submission = models.ForeignKey(ContactSubmission, on_delete=models.CASCADE)
    response_text = models.TextField()
    response_date = models.DateTimeField(auto_now_add=True)
    staff_member = models.ForeignKey(User, on_delete=models.CASCADE)
    
    class Meta:
        ordering = ['-response_date']
    
    def __str__(self):
        return f"Response to {self.contact_submission.name}"


# ================================
# B. CAREER MODELS
# ================================

class JobCategory(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    
    class Meta:
        verbose_name_plural = "Job Categories"
    
    def __str__(self):
        return self.name

class JobPosting(models.Model):
    EMPLOYMENT_TYPE_CHOICES = [
        ('FULL_TIME', 'Full Time'),
        ('PART_TIME', 'Part Time'),
        ('CONTRACT', 'Contract'),
        ('INTERNSHIP', 'Internship'),
    ]
    
    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('INACTIVE', 'Inactive'),
        ('CLOSED', 'Closed'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    requirements = models.TextField()
    location = models.CharField(max_length=200)
    department = models.CharField(max_length=200)
    employment_type = models.CharField(max_length=20, choices=EMPLOYMENT_TYPE_CHOICES, default='FULL_TIME')
    salary_range = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')
    posted_date = models.DateTimeField(auto_now_add=True)
    closing_date = models.DateField(blank=True, null=True)
    
    class Meta:
        ordering = ['-posted_date']
    
    def __str__(self):
        return self.title

class JobApplication(models.Model):
    APPLICATION_STATUS_CHOICES = [
        ('SUBMITTED', 'Submitted'),
        ('UNDER_REVIEW', 'Under Review'),
        ('SHORTLISTED', 'Shortlisted'),
        ('INTERVIEWED', 'Interviewed'),
        ('ACCEPTED', 'Accepted'),
        ('REJECTED', 'Rejected'),
    ]
    
    job_posting = models.ForeignKey(JobPosting, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    address = models.TextField(blank=True)
    
    # Experience and Education choices
    EXPERIENCE_CHOICES = [
        ('0-2', '0-2 years'),
        ('3-5', '3-5 years'),
        ('6-10', '6-10 years'),
        ('10+', '10+ years'),
    ]
    
    EDUCATION_CHOICES = [
        ('bachelor', "Bachelor's Degree"),
        ('master', "Master's Degree"),
        ('phd', 'PhD'),
        ('professional', 'Professional Certification'),
    ]
    
    experience = models.CharField(max_length=10, choices=EXPERIENCE_CHOICES, blank=True)
    education = models.CharField(max_length=20, choices=EDUCATION_CHOICES, blank=True)
    resume = models.FileField(upload_to='resumes/')
    cover_letter = models.TextField()
    status = models.CharField(max_length=20, choices=APPLICATION_STATUS_CHOICES, default='SUBMITTED')
    application_date = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-application_date']
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.job_posting.title}"


# ================================
# C. NEWSLETTER MODELS
# ================================

class SubscriptionCategory(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    
    class Meta:
        verbose_name_plural = "Subscription Categories"
    
    def __str__(self):
        return self.name

class Subscriber(models.Model):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)
    subscription_date = models.DateTimeField(auto_now_add=True)
    interests = models.ManyToManyField(SubscriptionCategory, blank=True)
    active_status = models.BooleanField(default=True)
    unsubscribe_token = models.CharField(max_length=100, unique=True, blank=True)
    
    class Meta:
        ordering = ['-subscription_date']
    
    def __str__(self):
        return self.email

class Newsletter(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    html_content = models.TextField(blank=True)
    send_date = models.DateTimeField(blank=True, null=True)
    recipient_count = models.IntegerField(default=0)
    categories = models.ManyToManyField(SubscriptionCategory, blank=True)
    created_date = models.DateTimeField(auto_now_add=True)
    sent = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-created_date']
    
    def __str__(self):
        return self.title


# ================================
# D. CONTENT MODELS
# ================================

class PageContent(models.Model):
    page_name = models.CharField(max_length=100)
    section = models.CharField(max_length=100)
    content = models.TextField()
    last_updated = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    
    class Meta:
        unique_together = ['page_name', 'section']
        ordering = ['page_name', 'section']
    
    def __str__(self):
        return f"{self.page_name} - {self.section}"

class ServiceDescription(models.Model):
    service_name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    features = models.TextField()
    main_image = models.ImageField(upload_to='services/', blank=True)
    gallery_images = models.JSONField(default=list, blank=True)  # Store list of image paths
    icon_class = models.CharField(max_length=50, blank=True)
    order = models.IntegerField(default=0)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', 'service_name']
    
    def __str__(self):
        return self.service_name

class CompanyInfo(models.Model):
    about_text = models.TextField()
    mission = models.TextField()
    vision = models.TextField()
    achievements = models.TextField()
    founded_year = models.IntegerField(blank=True, null=True)
    employee_count = models.CharField(max_length=50, blank=True)
    countries_served = models.IntegerField(blank=True, null=True)
    projects_completed = models.IntegerField(blank=True, null=True)
    last_updated = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Company Information"
        verbose_name_plural = "Company Information"
    
    def __str__(self):
        return "Company Information"


# ================================
# E. PROJECT MODELS
# ================================

class Project(models.Model):
    PROJECT_STATUS_CHOICES = [
        ('PLANNING', 'Planning'),
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed'),
        ('ON_HOLD', 'On Hold'),
        ('CANCELLED', 'Cancelled'),
    ]
    
    name = models.CharField(max_length=200)
    client = models.CharField(max_length=200)
    description = models.TextField()
    detailed_description = models.TextField(blank=True)
    start_date = models.DateField()
    completion_date = models.DateField(blank=True, null=True)
    category = models.ForeignKey(JobCategory, on_delete=models.CASCADE, related_name='projects')
    status = models.CharField(max_length=20, choices=PROJECT_STATUS_CHOICES, default='PLANNING')
    location = models.CharField(max_length=200, blank=True)
    project_value = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True)
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-completion_date', '-start_date']
    
    def __str__(self):
        return self.name

class ProjectImage(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='projects/')
    caption = models.CharField(max_length=200, blank=True)
    display_order = models.IntegerField(default=0)
    is_featured = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['display_order']
    
    def __str__(self):
        return f"{self.project.name} - Image {self.display_order}"

class ClientTestimonial(models.Model):
    client_name = models.CharField(max_length=200)
    client_position = models.CharField(max_length=200, blank=True)
    client_company = models.CharField(max_length=200, blank=True)
    testimonial = models.TextField()
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='testimonials')
    approved = models.BooleanField(default=False)
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)], default=5)
    date_given = models.DateField(auto_now_add=True)
    
    class Meta:
        ordering = ['-date_given']
    
    def __str__(self):
        return f"{self.client_name} - {self.project.name}"


# ================================
# F. ACHIEVEMENTS MODELS
# ================================

class AchievementCategory(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True, help_text="Font Awesome icon class")
    color = models.CharField(max_length=7, default="#007bff", help_text="Hex color code")
    
    class Meta:
        verbose_name_plural = "Achievement Categories"
        ordering = ['name']
    
    def __str__(self):
        return self.name

class Achievement(models.Model):
    ACHIEVEMENT_TYPE_CHOICES = [
        ('AWARD', 'Award'),
        ('CERTIFICATION', 'Certification'),
        ('MILESTONE', 'Milestone'),
        ('RECOGNITION', 'Recognition'),
        ('PROJECT_SUCCESS', 'Project Success'),
    ]
    
    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('ARCHIVED', 'Archived'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    short_description = models.CharField(max_length=300, blank=True, help_text="Brief description for cards")
    achievement_type = models.CharField(max_length=20, choices=ACHIEVEMENT_TYPE_CHOICES, default='MILESTONE')
    category = models.ForeignKey(AchievementCategory, on_delete=models.CASCADE, related_name='achievements')
    
    # Images
    featured_image = models.ImageField(upload_to='achievements/', blank=True)
    gallery_images = models.JSONField(default=list, blank=True, help_text="List of additional image URLs")
    
    # Dates and Status
    achievement_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')
    featured = models.BooleanField(default=False, help_text="Feature on homepage/top of achievements")
    
    # Metadata
    impact_metrics = models.JSONField(default=dict, blank=True, help_text="Key metrics (e.g., {'saved_cost': 500000, 'co2_reduced': 1000})")
    external_link = models.URLField(blank=True, help_text="Link to news article or external recognition")
    
    # Ordering and tracking
    display_order = models.IntegerField(default=0)
    view_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-achievement_date', 'display_order']
    
    def __str__(self):
        return self.title

class ProjectPortfolio(models.Model):
    PORTFOLIO_STATUS_CHOICES = [
        ('FEATURED', 'Featured'),
        ('STANDARD', 'Standard'),
        ('ARCHIVED', 'Archived'),
    ]
    
    PROJECT_TYPE_CHOICES = [
        ('OIL_SPILL', 'Oil Spill Response'),
        ('WATER_TREATMENT', 'Water Treatment'),
        ('ENVIRONMENTAL', 'Environmental Cleanup'),
        ('MARINE', 'Marine Services'),
        ('CONSULTANCY', 'Environmental Consultancy'),
        ('TRAINING', 'Training Program'),
        ('TECHNOLOGY', 'Technology Implementation'),
    ]
    
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    client = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    project_type = models.CharField(max_length=20, choices=PROJECT_TYPE_CHOICES)
    
    # Content
    brief_description = models.CharField(max_length=300, help_text="Short description for portfolio grid")
    detailed_description = models.TextField()
    challenge = models.TextField(blank=True, help_text="What challenges did this project address?")
    solution = models.TextField(blank=True, help_text="How did Axflo solve the challenges?")
    results = models.TextField(blank=True, help_text="What were the measurable outcomes?")
    
    # Project details
    start_date = models.DateField()
    completion_date = models.DateField(blank=True, null=True)
    project_value = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True)
    duration_months = models.IntegerField(blank=True, null=True)
    
    # Media
    featured_image = models.ImageField(upload_to='portfolio/', blank=True)
    before_image = models.ImageField(upload_to='portfolio/before/', blank=True)
    after_image = models.ImageField(upload_to='portfolio/after/', blank=True)
    gallery_images = models.JSONField(default=list, blank=True)
    
    # Metrics and achievements
    environmental_impact = models.JSONField(default=dict, blank=True, help_text="Environmental metrics achieved")
    key_statistics = models.JSONField(default=dict, blank=True, help_text="Key project statistics")
    
    # Status and display
    status = models.CharField(max_length=20, choices=PORTFOLIO_STATUS_CHOICES, default='STANDARD')
    featured_on_homepage = models.BooleanField(default=False)
    display_order = models.IntegerField(default=0)
    
    # SEO and tracking
    meta_description = models.CharField(max_length=160, blank=True)
    tags = models.CharField(max_length=200, blank=True, help_text="Comma-separated tags")
    view_count = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-completion_date', 'display_order']
        verbose_name = "Project Portfolio"
        verbose_name_plural = "Project Portfolio"
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if not self.slug:
            from django.utils.text import slugify
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
    
    def get_tags_list(self):
        if self.tags:
            return [tag.strip() for tag in self.tags.split(',')]
        return []

class CompanyMilestone(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    milestone_date = models.DateField()
    milestone_year = models.IntegerField()
    icon = models.CharField(max_length=50, blank=True, help_text="Font Awesome icon class")
    image = models.ImageField(upload_to='milestones/', blank=True)
    display_order = models.IntegerField(default=0)
    featured = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-milestone_date']
    
    def __str__(self):
        return f"{self.milestone_year} - {self.title}"
    
    def save(self, *args, **kwargs):
        if self.milestone_date:
            self.milestone_year = self.milestone_date.year
        super().save(*args, **kwargs)
