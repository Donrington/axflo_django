from django.core.management.base import BaseCommand
from axflo_app.models import InquiryCategory

class Command(BaseCommand):
    help = 'Seed the database with comprehensive inquiry categories for Axflo Oil and Gas'

    def handle(self, *args, **options):
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
        updated_count = 0

        for category_data in categories:
            category, created = InquiryCategory.objects.get_or_create(
                name=category_data['name'],
                defaults={'description': category_data['description']}
            )
            
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Created category: {category.name}')
                )
            else:
                # Update description if it exists
                if category.description != category_data['description']:
                    category.description = category_data['description']
                    category.save()
                    updated_count += 1
                    self.stdout.write(
                        self.style.WARNING(f'Updated category: {category.name}')
                    )

        self.stdout.write(
            self.style.SUCCESS(
                f'\nSeeding completed successfully!\n'
                f'Created: {created_count} new categories\n'
                f'Updated: {updated_count} existing categories\n'
                f'Total categories: {InquiryCategory.objects.count()}'
            )
        )