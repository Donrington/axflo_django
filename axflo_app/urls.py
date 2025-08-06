from django.urls import path
from . import views

app_name = 'axflo_app'

urlpatterns = [
    path('', views.index, name='index'),
    path('about/', views.about, name='about'),
    path('services/', views.services, name='services'),
    path('media/', views.media, name='media'),
    path('csr/', views.csr, name='csr'),
    path('careers/', views.careers, name='careers'),
    path('achievements/', views.achievements, name='achievements'),
    
    # Test Pages
    path('test-cookies/', views.test_cookies, name='test_cookies'),
    
    # Service Pages
    path('construction-services/', views.construction_services, name='construction_services'),
    path('engineering-consultancy/', views.engineering_consultancy, name='engineering_consultancy'),
    path('environmental-services/', views.environmental_services, name='environmental_services'),
    path('environmental-technologies/', views.environmental_technologies, name='environmental_technologies'),
    path('equipment-hire-services/', views.equipment_hire_services, name='equipment_hire_services'),
    path('incident-management/', views.incident_management, name='incident_management'),
    path('installation-services/', views.installation_services, name='installation_services'),
    path('marine-support-services/', views.marine_support_services, name='marine_support_services'),
    path('offshore-accommodation-services/', views.offshore_accommodation_services, name='offshore_accommodation_services'),
    path('offshore-marine-services/', views.offshore_marine_services, name='offshore_marine_services'),
    path('oil-spill-response/', views.oil_spill_response, name='oil_spill_response'),
    path('plant-operation-facility-management/', views.plant_operation_facility_management, name='plant_operation_facility_management'),
    path('preparedness-planning/', views.preparedness_planning, name='preparedness_planning'),
    path('procurement-logistics/', views.procurement_logistics, name='procurement_logistics'),
    path('project-management/', views.project_management, name='project_management'),
    path('renewable-energy/', views.renewable_energy, name='renewable_energy'),
    path('testing-commissioning/', views.testing_commissioning, name='testing_commissioning'),
    path('testing/', views.testing, name='testing'),
    path('training-programs/', views.training_programs, name='training_programs'),
    path('waste-recycling/', views.waste_recycling, name='waste_recycling'),
    path('water-wastewater-treatment/', views.water_wastewater_treatment, name='water_wastewater_treatment'),
    path('qshe/', views.qshe, name='qshe'),
    path('contact/', views.contact, name='contact'),
    
    # Admin Dashboard URLs
    path('admin-login/', views.admin_login, name='admin_login'),
    path('admin-register/', views.admin_register, name='admin_register'),
    path('admindashboard/', views.admindashboard, name='admindashboard'),
    path('admin-users/', views.admin_users, name='admin_users'),
    path('admin-contacts/', views.admin_contacts, name='admin_contacts'),
    path('admin-contact/<int:contact_id>/', views.admin_contact_detail, name='admin_contact_detail'),
    path('admin-contact/<int:contact_id>/toggle-read/', views.admin_contact_toggle_read, name='admin_contact_toggle_read'),
    path('admin-contact/<int:contact_id>/delete/', views.admin_contact_delete, name='admin_contact_delete'),
    path('admin-contacts/bulk-delete/', views.admin_contact_bulk_delete, name='admin_contact_bulk_delete'),
    path('admin-logout/', views.admin_logout, name='admin_logout'),
    
    # Newsletter URLs
    path('newsletter/subscribe/', views.newsletter_subscribe, name='newsletter_subscribe'),
    path('newsletter/unsubscribe/<str:token>/', views.newsletter_unsubscribe, name='newsletter_unsubscribe'),
    
    # Admin Newsletter Management URLs
    path('admin-subscribers/', views.admin_subscribers, name='admin_subscribers'),
    path('admin-newsletters/', views.admin_newsletters, name='admin_newsletters'),
    path('admin-newsletter-categories/', views.admin_newsletter_categories, name='admin_newsletter_categories'),
    path('admin-newsletter-create/', views.admin_newsletter_create, name='admin_newsletter_create'),
    path('admin-newsletter-edit/<int:newsletter_id>/', views.admin_newsletter_edit, name='admin_newsletter_edit'),
    path('admin-newsletter-delete/<int:newsletter_id>/', views.admin_newsletter_delete, name='admin_newsletter_delete'),
    path('admin-newsletter-category-delete/<int:category_id>/', views.admin_newsletter_category_delete, name='admin_newsletter_category_delete'),
    path('admin-subscriber/<int:subscriber_id>/toggle-status/', views.admin_subscriber_toggle_status, name='admin_subscriber_toggle_status'),
    path('admin-subscriber/<int:subscriber_id>/delete/', views.admin_subscriber_delete, name='admin_subscriber_delete'),
    
    # Career Management URLs
    path('submit-job-application/', views.submit_job_application, name='submit_job_application'),
    path('admin-careers/', views.admin_careers, name='admin_careers'),
    path('admin-career-create/', views.admin_career_create, name='admin_career_create'),
    path('admin-career-edit/<int:job_id>/', views.admin_career_edit, name='admin_career_edit'),
    path('admin-career-delete/<int:job_id>/', views.admin_career_delete, name='admin_career_delete'),
    path('admin-applications/', views.admin_applications, name='admin_applications'),
    path('admin-application-detail/<int:application_id>/', views.admin_application_detail, name='admin_application_detail'),
    path('admin-application-status/<int:application_id>/', views.admin_application_status, name='admin_application_status'),
    path('admin-application-delete/<int:application_id>/', views.admin_application_delete, name='admin_application_delete'),
    
    # Blog Management URLs
    path('admin-blog/', views.admin_blog, name='admin_blog'),
    path('admin-blog-create/', views.admin_blog_create, name='admin_blog_create'),
    path('admin-blog-edit/<int:article_id>/', views.admin_blog_edit, name='admin_blog_edit'),
    path('admin-blog-delete/<int:article_id>/', views.admin_blog_delete, name='admin_blog_delete'),
    path('admin-blog-categories/', views.admin_blog_categories, name='admin_blog_categories'),
    
    # Blog Detail Page
    path('blog/<slug:slug>/', views.blog_detail, name='blog_detail'),
    
    # Achievements & Portfolio Management URLs
    path('admin-achievements/', views.admin_achievements, name='admin_achievements'),
    path('admin-portfolio/', views.admin_portfolio, name='admin_portfolio'),
    path('admin-milestones/', views.admin_milestones, name='admin_milestones'),
    path('admin-achievement-categories/', views.admin_achievement_categories, name='admin_achievement_categories'),
    
    # Profile Management URLs
    path('admin-profile-view/', views.admin_profile_view, name='admin_profile_view'),
    path('admin-profile-edit/', views.admin_profile_edit, name='admin_profile_edit'),
    path('admin-profile-password/', views.admin_profile_password_change, name='admin_profile_password_change'),
    path('admin-profile-delete/', views.admin_profile_delete, name='admin_profile_delete'),
]
