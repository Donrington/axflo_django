# Admin Dashboard Setup Instructions

## Overview
A custom admin dashboard has been successfully created for your Axflo Django project with a custom login page and user management functionality.

## Features Created

### 1. Custom Admin Login Page
- **URL**: `/admin-login/`
- **Template**: `axflo_app/templates/axflo_app/admin/login.html`
- **Styled** to match your website's design with gold branding
- **Security**: Only allows staff and superuser accounts to login

### 2. Admin Dashboard
- **URL**: `/admin-dashboard/`
- **Template**: `axflo_app/templates/axflo_app/admin/dashboard.html`
- **Features**:
  - Welcome message with user's name
  - Statistics cards showing total users, staff members, and superusers
  - Quick access buttons to manage users, Django admin, and view website
  - Responsive design with glass morphism effects

### 3. User Management Page
- **URL**: `/admin-users/`
- **Template**: `axflo_app/templates/axflo_app/admin/users.html`
- **Features**:
  - Table view of all registered users
  - User avatars with initials
  - Status badges (Super Admin, Staff, User)
  - Last login and join date information

### 4. Authentication & Security
- **Login required** decorators on all admin views
- **Staff/Superuser** permission checks
- **Session management** with proper logout functionality
- **CSRF protection** on all forms

## Test Account Created
- **Username**: `admin`
- **Email**: `admin@axflo.com`
- **Password**: `admin123`
- **Role**: Superuser

## URLs Added
```python
# Admin Dashboard URLs
path('admin-login/', views.admin_login, name='admin_login'),
path('admindashboard/', views.admindashboard, name='admindashboard'),
path('admin-users/', views.admin_users, name='admin_users'),
path('admin-logout/', views.admin_logout, name='admin_logout'),
```

## How to Use

### 1. Start the Server
```bash
cd axflo_django
python manage.py runserver
```

### 2. Access the Admin Dashboard
1. Navigate to `http://127.0.0.1:8000/admin-login/`
2. Login with the test account:
   - Username: `admin`
   - Password: `admin123`
3. You'll be redirected to the dashboard at `/admindashboard/`

### 3. Navigation
- **Dashboard**: Overview and quick actions
- **Users**: Manage all registered users
- **Django Admin**: Access built-in Django admin interface
- **View Site**: Preview the public website
- **Logout**: Secure logout functionality

## Design Features
- **Consistent branding** with your Axflo color scheme
- **Responsive design** for desktop and mobile
- **Glass morphism effects** with backdrop blur
- **Smooth animations** and hover effects
- **Professional typography** using Epilogue font

## Security Notes
- Only staff members and superusers can access the admin dashboard
- All admin views require authentication
- Proper session management with secure logout
- CSRF protection on all forms
- Login URL redirects configured in settings

## Database Management Commands

### Seeding Commands

#### 1. Seed All Categories
```bash
python manage.py seed_all_categories
```
Seeds all category types including blog, job, subscription, achievement, and inquiry categories.

**Options:**
```bash
python manage.py seed_all_categories --categories blog        # Seed only blog categories
python manage.py seed_all_categories --categories job         # Seed only job categories
python manage.py seed_all_categories --categories subscription # Seed only subscription categories
python manage.py seed_all_categories --categories achievement # Seed only achievement categories
python manage.py seed_all_categories --categories inquiry     # Seed only inquiry categories
```

#### 2. Seed Inquiry Categories (Legacy)
```bash
python manage.py seed_inquiry_categories
```
Seeds comprehensive inquiry categories for contact forms.

#### 3. Seed Sample Blog Content
```bash
python manage.py seed_sample_content
```
Creates sample blog articles and categories for testing the news section.

#### 4. Create Test Data
```bash
python manage.py create_test_data
```
Creates comprehensive test data including:
- Achievement categories and achievements
- Project portfolio entries
- Company milestones

### Quality Testing Commands

#### 1. Create Quality Test Data
```bash
python manage.py quality_test_all_content
```
Creates comprehensive test content for quality assurance across all platform features.

**Options:**
```bash
python manage.py quality_test_all_content --content-type blog         # Test only blog content
python manage.py quality_test_all_content --content-type careers      # Test only career content  
python manage.py quality_test_all_content --content-type achievements # Test only achievement content
python manage.py quality_test_all_content --content-type projects     # Test only project content
python manage.py quality_test_all_content --content-type milestones   # Test only milestone content
python manage.py quality_test_all_content --content-type contacts     # Test only contact content
python manage.py quality_test_all_content --content-type newsletters  # Test only newsletter content
python manage.py quality_test_all_content --clean                     # Clean existing test data before creating new
```

### Data Cleanup Commands

#### 1. Clean Specific Test Data
```bash
python manage.py quality_test_all_content --clean --content-type blog
python manage.py quality_test_all_content --clean --content-type careers
python manage.py quality_test_all_content --clean --content-type achievements
python manage.py quality_test_all_content --clean --content-type projects
python manage.py quality_test_all_content --clean --content-type milestones
python manage.py quality_test_all_content --clean --content-type contacts
python manage.py quality_test_all_content --clean --content-type newsletters
```

#### 2. Clean All Test Data
```bash
python manage.py quality_test_all_content --clean --content-type all
```

#### 3. Manual Database Cleanup (Django Shell)
```bash
python manage.py shell
```

Then run these Python commands to clean specific data:
```python
# Clean test blog articles
from axflo_app.models import NewsArticle
NewsArticle.objects.filter(title__icontains='[TEST]').delete()

# Clean test job applications
from axflo_app.models import JobPosting, JobApplication
JobPosting.objects.filter(title__icontains='[TEST]').delete()
JobApplication.objects.filter(first_name__icontains='TEST').delete()

# Clean test achievements
from axflo_app.models import Achievement
Achievement.objects.filter(title__icontains='[TEST]').delete()

# Clean test projects
from axflo_app.models import Project, ProjectPortfolio
Project.objects.filter(name__icontains='[TEST]').delete()
ProjectPortfolio.objects.filter(title__icontains='[TEST]').delete()

# Clean test milestones
from axflo_app.models import CompanyMilestone
CompanyMilestone.objects.filter(title__icontains='[TEST]').delete()

# Clean test contacts
from axflo_app.models import ContactSubmission
ContactSubmission.objects.filter(name__icontains='TEST').delete()

# Clean test newsletters and subscribers
from axflo_app.models import Newsletter, Subscriber
Newsletter.objects.filter(title__icontains='[TEST]').delete()
Subscriber.objects.filter(email__icontains='test').delete()
```

## Test User Accounts

### Main Admin Account (Created by You)
- **Username**: `axflo_admin`
- **Password**: [Your chosen password]
- **Role**: Superuser

### Test Users Created by Commands
These are automatically created by the `quality_test_all_content` command:

#### 1. System Administrator
- **Username**: `admin`
- **Email**: `admin@axflo.com`
- **Password**: `testpassword123`
- **Role**: Superuser (is_staff=True, is_superuser=True)
- **Name**: System Administrator

#### 2. Content Editor
- **Username**: `editor`
- **Email**: `editor@axflo.com`
- **Password**: `testpassword123`
- **Role**: Staff (is_staff=True, is_superuser=False)
- **Name**: Content Editor

#### 3. HR Manager
- **Username**: `hr_manager`
- **Email**: `hr@axflo.com`
- **Password**: `testpassword123`
- **Role**: Staff (is_staff=True, is_superuser=False)
- **Name**: HR Manager

#### 4. Project Manager
- **Username**: `project_manager`
- **Email**: `pm@axflo.com`
- **Password**: `testpassword123`
- **Role**: Staff (is_staff=True, is_superuser=False)
- **Name**: Project Manager

### Sample Test Subscribers (Newsletters)
Created by quality testing command:
- test.subscriber1@company.com (TEST_John Doe)
- test.subscriber2@energy.com (TEST_Jane Smith)
- test.subscriber3@maritime.com (TEST_Mike Johnson)
- test.subscriber4@oilgas.com (TEST_Sarah Wilson)
- test.subscriber5@petrotech.com (TEST_David Brown)

### Sample Job Applications
Test job applications are created with applicants:
- TEST_John Doe (john.doe.test@email.com)
- TEST_Sarah Johnson (sarah.johnson.test@email.com)
- TEST_Michael Chen (michael.chen.test@email.com)

## Command Usage Examples

### Complete Setup Workflow
```bash
# 1. Seed all categories first
python manage.py seed_all_categories

# 2. Create comprehensive test data
python manage.py create_test_data

# 3. Add sample blog content
python manage.py seed_sample_content

# 4. Create quality test data for all features
python manage.py quality_test_all_content
```

### Testing Specific Features
```bash
# Test only blog functionality
python manage.py quality_test_all_content --content-type blog

# Test career/job functionality with clean slate
python manage.py quality_test_all_content --clean --content-type careers

# Test newsletter functionality
python manage.py quality_test_all_content --content-type newsletters
```

### Reset and Clean Data
```bash
# Clean all test data and recreate
python manage.py quality_test_all_content --clean --content-type all
```

## Next Steps
1. Create additional staff user accounts as needed
2. Customize the dashboard statistics based on your requirements
3. Add additional admin functionality as your project grows
4. Consider adding email notifications or logging for admin actions
5. Use the testing commands to populate your database with sample data for development
6. Clean test data before deploying to production

The admin dashboard is now fully functional and ready for use!