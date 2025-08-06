from django.core.management.base import BaseCommand
from django.utils.text import slugify
from axflo_app.models import (
    BlogCategory, 
    JobCategory, 
    SubscriptionCategory, 
    AchievementCategory,
    InquiryCategory
)

class Command(BaseCommand):
    help = 'Seed all categories for the Axflo Oil and Gas platform'

    def add_arguments(self, parser):
        parser.add_argument(
            '--categories',
            type=str,
            choices=['all', 'blog', 'job', 'subscription', 'achievement', 'inquiry'],
            default='all',
            help='Specify which categories to seed'
        )

    def handle(self, *args, **options):
        category_type = options['categories']
        
        self.stdout.write(
            self.style.SUCCESS(f'Starting to seed {category_type} categories...\n')
        )
        
        if category_type in ['all', 'blog']:
            self.seed_blog_categories()
        
        if category_type in ['all', 'job']:
            self.seed_job_categories()
            
        if category_type in ['all', 'subscription']:
            self.seed_subscription_categories()
            
        if category_type in ['all', 'achievement']:
            self.seed_achievement_categories()
            
        if category_type in ['all', 'inquiry']:
            self.seed_inquiry_categories()
        
        self.stdout.write(
            self.style.SUCCESS('\n✅ All category seeding completed successfully!')
        )

    def seed_blog_categories(self):
        """Seed blog categories for news and articles"""
        self.stdout.write('🔄 Seeding Blog Categories...')
        
        categories = [
            {
                'name': 'Company News',
                'description': 'Latest company announcements, milestones, and corporate updates from Axflo.',
                'slug': 'company-news'
            },
            {
                'name': 'Industry Insights',
                'description': 'Analysis and commentary on oil and gas industry trends, market developments, and future outlook.',
                'slug': 'industry-insights'
            },
            {
                'name': 'Project Updates',
                'description': 'Updates on ongoing and completed projects, showcasing Axflo\'s engineering and construction capabilities.',
                'slug': 'project-updates'
            },
            {
                'name': 'Technology & Innovation',
                'description': 'Latest technological advancements, innovative solutions, and digital transformation in oil and gas.',
                'slug': 'technology-innovation'
            },
            {
                'name': 'Safety & Environment',
                'description': 'Safety protocols, environmental initiatives, HSE best practices, and sustainability efforts.',
                'slug': 'safety-environment'
            },
            {
                'name': 'Training & Development',
                'description': 'Training programs, skill development, certification courses, and capacity building initiatives.',
                'slug': 'training-development'
            },
            {
                'name': 'Marine Operations',
                'description': 'Maritime services, offshore operations, vessel management, and marine logistics updates.',
                'slug': 'marine-operations'
            },
            {
                'name': 'Engineering Solutions',
                'description': 'Technical engineering insights, design solutions, and consultancy services highlights.',
                'slug': 'engineering-solutions'
            },
            {
                'name': 'Partnerships & Alliances',
                'description': 'Strategic partnerships, joint ventures, collaborations, and business alliances.',
                'slug': 'partnerships-alliances'
            },
            {
                'name': 'Awards & Recognition',
                'description': 'Industry awards, certifications, recognitions, and achievement highlights.',
                'slug': 'awards-recognition'
            }
        ]
        
        created_count = 0
        for category_data in categories:
            category, created = BlogCategory.objects.get_or_create(
                name=category_data['name'],
                defaults={
                    'description': category_data['description'],
                    'slug': category_data['slug']
                }
            )
            
            if created:
                created_count += 1
                self.stdout.write(f'  ✓ Created: {category.name}')
        
        self.stdout.write(f'  📊 Blog Categories: {created_count} created, {BlogCategory.objects.count()} total\n')

    def seed_job_categories(self):
        """Seed job categories for career opportunities"""
        self.stdout.write('🔄 Seeding Job Categories...')
        
        categories = [
            {
                'name': 'Engineering & Design',
                'description': 'Engineering positions including mechanical, civil, electrical, chemical, and petroleum engineers.'
            },
            {
                'name': 'Project Management',
                'description': 'Project managers, coordinators, and planning specialists for oil and gas projects.'
            },
            {
                'name': 'Operations & Maintenance',
                'description': 'Operations supervisors, maintenance technicians, and facility operators.'
            },
            {
                'name': 'Health, Safety & Environment',
                'description': 'HSE officers, safety coordinators, environmental specialists, and compliance managers.'
            },
            {
                'name': 'Marine & Offshore',
                'description': 'Marine engineers, offshore technicians, vessel crew, and maritime specialists.'
            },
            {
                'name': 'Construction & Installation',
                'description': 'Construction managers, installation technicians, welders, and field supervisors.'
            },
            {
                'name': 'Quality Assurance',
                'description': 'QA/QC inspectors, quality managers, and certification specialists.'
            },
            {
                'name': 'Procurement & Logistics',
                'description': 'Procurement officers, logistics coordinators, and supply chain managers.'
            },
            {
                'name': 'Finance & Administration',
                'description': 'Financial analysts, accountants, HR professionals, and administrative staff.'
            },
            {
                'name': 'Business Development',
                'description': 'Sales representatives, business development managers, and marketing professionals.'
            },
            {
                'name': 'Information Technology',
                'description': 'IT specialists, software developers, systems administrators, and data analysts.'
            },
            {
                'name': 'Training & Development',
                'description': 'Training coordinators, instructors, and learning & development specialists.'
            },
            {
                'name': 'Research & Development',
                'description': 'R&D engineers, innovation specialists, and technology researchers.'
            },
            {
                'name': 'Internships & Graduates',
                'description': 'Entry-level positions, graduate programs, and internship opportunities.'
            }
        ]
        
        created_count = 0
        for category_data in categories:
            category, created = JobCategory.objects.get_or_create(
                name=category_data['name'],
                defaults={'description': category_data['description']}
            )
            
            if created:
                created_count += 1
                self.stdout.write(f'  ✓ Created: {category.name}')
        
        self.stdout.write(f'  📊 Job Categories: {created_count} created, {JobCategory.objects.count()} total\n')

    def seed_subscription_categories(self):
        """Seed subscription categories for newsletter interests"""
        self.stdout.write('🔄 Seeding Subscription Categories...')
        
        categories = [
            {
                'name': 'Company Updates',
                'description': 'Latest company news, announcements, and corporate developments.'
            },
            {
                'name': 'Technical Insights',
                'description': 'Technical articles, engineering solutions, and industry best practices.'
            },
            {
                'name': 'Project Highlights',
                'description': 'Featured projects, case studies, and project completion updates.'
            },
            {
                'name': 'Industry News',
                'description': 'Oil and gas industry trends, market analysis, and regulatory updates.'
            },
            {
                'name': 'Safety & HSE',
                'description': 'Health, safety, and environmental updates, protocols, and training information.'
            },
            {
                'name': 'Training & Events',
                'description': 'Training programs, workshops, conferences, and industry events.'
            },
            {
                'name': 'Technology Updates',
                'description': 'New technologies, innovations, and digital transformation in oil and gas.'
            },
            {
                'name': 'Career Opportunities',
                'description': 'Job openings, career development, and recruitment updates.'
            },
            {
                'name': 'Marine Services',
                'description': 'Maritime operations, offshore services, and vessel management updates.'
            },
            {
                'name': 'Environmental Initiatives',
                'description': 'Sustainability projects, environmental programs, and green technology updates.'
            }
        ]
        
        created_count = 0
        for category_data in categories:
            category, created = SubscriptionCategory.objects.get_or_create(
                name=category_data['name'],
                defaults={'description': category_data['description']}
            )
            
            if created:
                created_count += 1
                self.stdout.write(f'  ✓ Created: {category.name}')
        
        self.stdout.write(f'  📊 Subscription Categories: {created_count} created, {SubscriptionCategory.objects.count()} total\n')

    def seed_achievement_categories(self):
        """Seed achievement categories for company milestones"""
        self.stdout.write('🔄 Seeding Achievement Categories...')
        
        categories = [
            {
                'name': 'Project Excellence',
                'description': 'Outstanding project delivery, client satisfaction, and engineering excellence.',
                'icon': 'fas fa-trophy',
                'color': '#d6a019'
            },
            {
                'name': 'Safety Awards',
                'description': 'Safety achievements, HSE recognitions, and zero-incident milestones.',
                'icon': 'fas fa-shield-alt',
                'color': '#10b981'
            },
            {
                'name': 'Industry Recognition',
                'description': 'Industry awards, certifications, and professional recognitions.',
                'icon': 'fas fa-award',
                'color': '#3b82f6'
            },
            {
                'name': 'Innovation & Technology',
                'description': 'Technology innovations, digital transformation, and R&D achievements.',
                'icon': 'fas fa-lightbulb',
                'color': '#f59e0b'
            },
            {
                'name': 'Environmental Stewardship',
                'description': 'Environmental awards, sustainability initiatives, and green technology adoption.',
                'icon': 'fas fa-leaf',
                'color': '#22c55e'
            },
            {
                'name': 'Quality Excellence',
                'description': 'Quality certifications, ISO standards, and quality management achievements.',
                'icon': 'fas fa-certificate',
                'color': '#8b5cf6'
            },
            {
                'name': 'Business Milestones',
                'description': 'Corporate milestones, market expansion, and business growth achievements.',
                'icon': 'fas fa-chart-line',
                'color': '#ef4444'
            },
            {
                'name': 'Partnership Success',
                'description': 'Strategic partnerships, joint ventures, and collaborative achievements.',
                'icon': 'fas fa-handshake',
                'color': '#06b6d4'
            },
            {
                'name': 'Training & Development',
                'description': 'Training program recognitions, skills development, and capacity building awards.',
                'icon': 'fas fa-graduation-cap',
                'color': '#84cc16'
            },
            {
                'name': 'Community Impact',
                'description': 'Community service, CSR initiatives, and social impact achievements.',
                'icon': 'fas fa-heart',
                'color': '#ec4899'
            }
        ]
        
        created_count = 0
        for category_data in categories:
            category, created = AchievementCategory.objects.get_or_create(
                name=category_data['name'],
                defaults={
                    'description': category_data['description'],
                    'icon': category_data['icon'],
                    'color': category_data['color']
                }
            )
            
            if created:
                created_count += 1
                self.stdout.write(f'  ✓ Created: {category.name}')
        
        self.stdout.write(f'  📊 Achievement Categories: {created_count} created, {AchievementCategory.objects.count()} total\n')

    def seed_inquiry_categories(self):
        """Seed inquiry categories (calls existing command logic)"""
        self.stdout.write('🔄 Seeding Inquiry Categories...')
        
        categories = [
            {
                'name': 'EPC Contracting Services',
                'description': 'Engineering, Procurement, and Construction services for oil and gas projects including design, sourcing, and construction management.'
            },
            {
                'name': 'Engineering & Consultancy',
                'description': 'Technical engineering solutions, feasibility studies, project consulting, and design services for oil and gas infrastructure.'
            },
            {
                'name': 'Procurement & Logistics',
                'description': 'Equipment sourcing, material procurement, supply chain management, and logistics coordination for oil and gas operations.'
            },
            {
                'name': 'Construction Services',
                'description': 'Civil, mechanical, electrical, and instrumentation construction for refineries, pipelines, and production facilities.'
            },
            {
                'name': 'Installation Services',
                'description': 'Equipment installation, pipeline laying, offshore platform installation, and mechanical assembly services.'
            },
            {
                'name': 'Testing & Commissioning',
                'description': 'Pre-commissioning, commissioning, performance testing, and startup services for oil and gas facilities.'
            },
            {
                'name': 'Project Management',
                'description': 'End-to-end project management, planning, scheduling, and execution oversight for oil and gas projects.'
            },
            {
                'name': 'Plant Operation & Facility Management',
                'description': 'Operations management, maintenance services, and facility management for oil and gas production facilities.'
            },
            {
                'name': 'Offshore Marine Services',
                'description': 'Marine transportation, offshore logistics, vessel chartering, and marine support for offshore oil and gas operations.'
            },
            {
                'name': 'Marine Support Services',
                'description': 'Port services, marine equipment rental, crew boat services, and marine logistics support.'
            },
            {
                'name': 'Offshore Accommodation Services',
                'description': 'Offshore accommodation platforms, catering services, and personnel logistics for offshore operations.'
            },
            {
                'name': 'Equipment Hire Services',
                'description': 'Rental of specialized oil and gas equipment, machinery, tools, and instrumentation for short and long-term projects.'
            },
            {
                'name': 'Environmental Technologies',
                'description': 'Environmental monitoring, pollution control systems, and sustainable technology solutions for oil and gas operations.'
            },
            {
                'name': 'Water & Wastewater Treatment',
                'description': 'Water treatment systems, wastewater management, produced water treatment, and water recycling solutions.'
            },
            {
                'name': 'Waste Management & Recycling',
                'description': 'Industrial waste management, hazardous waste disposal, recycling services, and waste reduction programs.'
            },
            {
                'name': 'Renewable Energy Solutions',
                'description': 'Solar, wind, and hybrid renewable energy systems for oil and gas facilities and energy transition projects.'
            },
            {
                'name': 'Oil Spill Response',
                'description': 'Emergency oil spill response, containment systems, cleanup services, and environmental remediation.'
            },
            {
                'name': 'Emergency Preparedness & Planning',
                'description': 'Emergency response planning, risk assessment, crisis management, and disaster preparedness consulting.'
            },
            {
                'name': 'Incident Management',
                'description': 'Incident response coordination, investigation services, and safety management system implementation.'
            },
            {
                'name': 'Training Programs',
                'description': 'Safety training, technical skills development, certification programs, and capacity building for oil and gas personnel.'
            },
            {
                'name': 'Health, Safety & Environment (HSE)',
                'description': 'HSE consulting, safety audits, risk assessments, and compliance management for oil and gas operations.'
            },
            {
                'name': 'Quality Assurance & Control',
                'description': 'Quality management systems, inspection services, testing, and certification for oil and gas projects.'
            },
            {
                'name': 'Partnership & Joint Ventures',
                'description': 'Strategic partnerships, joint venture opportunities, collaboration proposals, and business development inquiries.'
            },
            {
                'name': 'Career Opportunities',
                'description': 'Job applications, career inquiries, recruitment partnerships, and talent acquisition discussions.'
            },
            {
                'name': 'General Business Inquiry',
                'description': 'General questions about Axflo services, company information, or business opportunities not covered by specific categories.'
            },
            {
                'name': 'Technical Support',
                'description': 'Technical assistance, troubleshooting, maintenance support, and after-sales service for existing projects.'
            },
            {
                'name': 'Supplier & Vendor Inquiries',
                'description': 'Supplier registration, vendor partnerships, subcontracting opportunities, and procurement-related inquiries.'
            },
            {
                'name': 'Investment & Finance',
                'description': 'Investment opportunities, project financing, financial partnerships, and capital investment discussions.'
            }
        ]

        created_count = 0
        for category_data in categories:
            category, created = InquiryCategory.objects.get_or_create(
                name=category_data['name'],
                defaults={'description': category_data['description']}
            )
            
            if created:
                created_count += 1
                self.stdout.write(f'  ✓ Created: {category.name}')
        
        self.stdout.write(f'  📊 Inquiry Categories: {created_count} created, {InquiryCategory.objects.count()} total\n')