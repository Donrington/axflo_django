# Axflo Oil & Gas Django Website

## Project Structure
```
axflo_django/
├── axflo_project/           # Django project settings
├── axflo_app/              # Main Django app
│   ├── static/
│   │   └── axflo_app/
│   │       ├── css/        # Extracted CSS files
│   │       ├── js/         # Extracted JavaScript files
│   │       └── images/     # Static images
│   ├── templates/
│   │   └── axflo_app/      # Django templates
│   ├── models.py           # Database models
│   ├── views.py            # View functions
│   └── urls.py             # URL routing
├── media/                  # User uploaded files
└── static/                 # Collected static files
```

## Setup Instructions

1. **Create Django Project**
   ```bash
   cd axflo_django
   django-admin startproject axflo_project .
   ```

2. **Install Dependencies**
   ```bash
   pip install django pillow
   ```

3. **Update Settings**
   Add to INSTALLED_APPS in settings.py:
   ```python
   'axflo_app',
   ```

   Add to settings.py:
   ```python
   import os
   
   STATIC_URL = '/static/'
   STATICFILES_DIRS = [
       BASE_DIR / 'axflo_app' / 'static',
   ]
   
   MEDIA_URL = '/media/'
   MEDIA_ROOT = BASE_DIR / 'media'
   ```

4. **Update Main URLs**
   In axflo_project/urls.py:
   ```python
   from django.contrib import admin
   from django.urls import path, include
   from django.conf import settings
   from django.conf.urls.static import static

   urlpatterns = [
       path('admin/', admin.site.urls),
       path('', include('axflo_app.urls')),
   ]

   if settings.DEBUG:
       urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
       urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
   ```

5. **Run Migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create Superuser**
   ```bash
   python manage.py createsuperuser
   ```

7. **Collect Static Files**
   ```bash
   python manage.py collectstatic
   ```

8. **Run Server**
   ```bash
   python manage.py runserver
   ```

## Features Organized

- [x] Separated inline CSS into individual files
- [x] Extracted JavaScript into separate files
- [x] Converted HTML to Django templates
- [x] Organized static files (CSS, JS, Images)
- [x] Created proper Django app structure
- [x] Added Django models for dynamic content
- [x] Set up proper URL routing

## Next Steps

1. Add Django admin integration for content management
2. Implement contact forms
3. Add database-driven content
4. Set up production deployment
5. Add user authentication if needed
