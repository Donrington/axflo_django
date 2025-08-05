from django.core.management.base import BaseCommand
from django.utils import timezone
from axflo_app.models import Achievement, AchievementCategory, ProjectPortfolio, CompanyMilestone
from datetime import datetime, date
import json

class Command(BaseCommand):
    help = 'Create comprehensive test data for Axflo Oil and Gas Nigeria Ltd'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting test data creation for Axflo Oil and Gas Nigeria Ltd...'))
        self.stdout.write('=' * 60)
        
        try:
            # Create categories first (required for achievements)
            self.stdout.write('\n1. Creating Achievement Categories...')
            categories = self.create_achievement_categories()
            
            # Create achievements
            self.stdout.write('\n2. Creating Achievements...')
            self.create_achievements(categories)
            
            # Create project portfolio
            self.stdout.write('\n3. Creating Project Portfolio...')
            self.create_project_portfolio()
            
            # Create company milestones
            self.stdout.write('\n4. Creating Company Milestones...')
            self.create_company_milestones()
            
            self.stdout.write('\n' + '=' * 60)
            self.stdout.write(self.style.SUCCESS('Test data creation completed successfully!\n'))
            self.stdout.write('Summary:')
            self.stdout.write(f'- Achievement Categories: {AchievementCategory.objects.count()}')
            self.stdout.write(f'- Achievements: {Achievement.objects.count()}')
            self.stdout.write(f'- Project Portfolio: {ProjectPortfolio.objects.count()}')
            self.stdout.write(f'- Company Milestones: {CompanyMilestone.objects.count()}')
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error creating test data: {str(e)}'))
            import traceback
            traceback.print_exc()

    def create_achievement_categories(self):
        """Create achievement categories"""
        categories_data = [
            {
                'name': 'Environmental Excellence',
                'description': 'Awards and recognitions for environmental protection and sustainability initiatives',
                'icon': 'fa-leaf',
                'color': '#4caf50'
            },
            {
                'name': 'Safety Awards',
                'description': 'Recognition for outstanding safety performance and zero incident achievements',
                'icon': 'fa-shield-alt',
                'color': '#ff9800'
            },
            {
                'name': 'Industry Leadership',
                'description': 'Awards recognizing leadership and innovation in the oil and gas industry',
                'icon': 'fa-trophy',
                'color': '#d6a019'
            },
            {
                'name': 'Community Impact',
                'description': 'Recognition for corporate social responsibility and community development',
                'icon': 'fa-heart',
                'color': '#e91e63'
            },
            {
                'name': 'Technical Innovation',
                'description': 'Awards for technological advancement and engineering excellence',
                'icon': 'fa-cog',
                'color': '#2196f3'
            }
        ]
        
        created_categories = {}
        for cat_data in categories_data:
            category, created = AchievementCategory.objects.get_or_create(
                name=cat_data['name'],
                defaults={
                    'description': cat_data['description'],
                    'icon': cat_data['icon'],
                    'color': cat_data['color']
                }
            )
            created_categories[cat_data['name']] = category
            self.stdout.write(f"{'Created' if created else 'Updated'} category: {category.name}")
        
        return created_categories

    def create_achievements(self, categories):
        """Create achievement records"""
        achievements_data = [
            {
                'title': 'Best Environmental Practice Award 2023',
                'achievement_type': 'AWARD',
                'category': 'Environmental Excellence',
                'achievement_date': date(2023, 11, 15),
                'short_description': 'Recognized by the Nigerian Environmental Protection Agency for outstanding environmental stewardship.',
                'description': 'Axflo Oil and Gas Nigeria Ltd was honored with the Best Environmental Practice Award 2023 by the Nigerian Environmental Protection Agency. This prestigious award recognizes our commitment to environmental protection through innovative oil spill response technologies, waste management systems, and renewable energy initiatives. Our comprehensive environmental management program has resulted in zero environmental incidents across all operations.',
                'external_link': 'https://example.com/nepa-award-2023',
                'impact_metrics': json.dumps({
                    'environmental_incidents': 0,
                    'waste_recycled_tons': 2500,
                    'carbon_footprint_reduction': '35%',
                    'renewable_energy_adoption': '40%'
                }),
                'status': 'PUBLISHED',
                'featured': True,
                'display_order': 1
            },
            {
                'title': 'Zero Accident Achievement - 2 Million Safe Hours',
                'achievement_type': 'MILESTONE',
                'category': 'Safety Awards',
                'achievement_date': date(2024, 1, 20),
                'short_description': 'Achieved 2 million man-hours without a single workplace accident across all operations.',
                'description': 'Axflo has successfully completed 2 million man-hours of work without a single Lost Time Injury (LTI). This remarkable safety milestone demonstrates our unwavering commitment to the health and safety of our workforce. Our comprehensive safety management system, regular training programs, and proactive hazard identification have created a culture of safety excellence that sets industry standards.',
                'impact_metrics': json.dumps({
                    'safe_work_hours': 2000000,
                    'lti_rate': 0,
                    'safety_training_hours': 15000,
                    'safety_audits_completed': 120
                }),
                'status': 'PUBLISHED',
                'featured': True,
                'display_order': 2
            },
            {
                'title': 'Outstanding Oil Spill Response Excellence Award',
                'achievement_type': 'AWARD',
                'category': 'Technical Innovation',
                'achievement_date': date(2023, 8, 30),
                'short_description': 'Recognized for rapid and effective oil spill response capabilities in the Niger Delta.',
                'description': 'The Nigerian Maritime Administration and Safety Agency (NIMASA) awarded Axflo the Outstanding Oil Spill Response Excellence Award for our exceptional response to the Port Harcourt incident. Our team deployed advanced containment and recovery systems within 2 hours, preventing environmental damage and demonstrating world-class response capabilities.',
                'external_link': 'https://example.com/nimasa-award-2023',
                'impact_metrics': json.dumps({
                    'response_time_hours': 2,
                    'oil_recovered_barrels': 850,
                    'coastline_protected_km': 25,
                    'wildlife_rescued': 45
                }),
                'status': 'PUBLISHED',
                'featured': True,
                'display_order': 3
            },
            {
                'title': 'Community Development Partnership Award',
                'achievement_type': 'AWARD',
                'category': 'Community Impact',
                'achievement_date': date(2023, 12, 10),
                'short_description': 'Honored for exceptional community development initiatives in host communities.',
                'description': 'The Rivers State Government recognized Axflo for our comprehensive community development program. Our initiatives include building schools, healthcare centers, providing scholarships, and creating sustainable livelihood programs for host communities. This award acknowledges our commitment to shared prosperity and sustainable development.',
                'impact_metrics': json.dumps({
                    'schools_built': 5,
                    'healthcare_centers': 3,
                    'scholarships_awarded': 150,
                    'jobs_created': 500,
                    'communities_impacted': 12
                }),
                'status': 'PUBLISHED',
                'featured': False,
                'display_order': 4
            },
            {
                'title': 'ISO 14001:2015 Environmental Certification',
                'achievement_type': 'CERTIFICATION',
                'category': 'Environmental Excellence',
                'achievement_date': date(2023, 6, 15),
                'short_description': 'Successfully obtained ISO 14001:2015 certification for environmental management systems.',
                'description': 'Axflo achieved ISO 14001:2015 certification, demonstrating our systematic approach to environmental management. This international standard validates our environmental policies, procedures, and continuous improvement practices across all operations.',
                'status': 'PUBLISHED',
                'featured': False,
                'display_order': 5
            },
            {
                'title': 'Nigerian Oil and Gas Industry Innovation Award',
                'achievement_type': 'AWARD',
                'category': 'Industry Leadership',
                'achievement_date': date(2024, 2, 28),
                'short_description': 'Recognized for innovative solutions in offshore marine operations.',
                'description': 'The Nigerian Association of Petroleum Explorationists (NAPE) honored Axflo with the Innovation Award for our groundbreaking offshore accommodation systems and marine support technologies. Our innovative approach to offshore operations has improved efficiency and safety standards across the industry.',
                'impact_metrics': json.dumps({
                    'efficiency_improvement': '45%',
                    'cost_reduction': '30%',
                    'safety_incidents': 0,
                    'technology_patents': 3
                }),
                'status': 'PUBLISHED',
                'featured': True,
                'display_order': 6
            }
        ]
        
        for ach_data in achievements_data:
            achievement, created = Achievement.objects.get_or_create(
                title=ach_data['title'],
                defaults={
                    'achievement_type': ach_data['achievement_type'],
                    'category': categories[ach_data['category']],
                    'achievement_date': ach_data['achievement_date'],
                    'short_description': ach_data['short_description'],
                    'description': ach_data['description'],
                    'external_link': ach_data.get('external_link', ''),
                    'impact_metrics': ach_data.get('impact_metrics', '{}'),
                    'status': ach_data['status'],
                    'featured': ach_data['featured'],
                    'display_order': ach_data['display_order']
                }
            )
            self.stdout.write(f"{'Created' if created else 'Updated'} achievement: {achievement.title}")

    def create_project_portfolio(self):
        """Create project portfolio entries"""
        projects_data = [
            {
                'title': 'Shell Petroleum Development Company Oil Spill Response',
                'client': 'Shell Petroleum Development Company',
                'location': 'Niger Delta, Rivers State',
                'project_type': 'ENVIRONMENTAL',
                'brief_description': 'Emergency oil spill response and environmental remediation project in the Niger Delta region.',
                'detailed_description': 'Comprehensive oil spill response operation involving containment, recovery, and environmental remediation across 50 square kilometers of affected area. Deployed advanced skimming systems, dispersants, and bioremediation technologies.',
                'challenge': 'The spill occurred in sensitive mangrove ecosystem during rainy season, making access difficult and requiring specialized equipment and techniques to minimize environmental impact.',
                'solution': 'Deployed amphibious vehicles, lightweight containment booms, and environmentally-friendly dispersants. Implemented real-time monitoring systems and coordinated with local communities for effective response.',
                'results': 'Successfully recovered 85% of spilled oil, restored affected ecosystem within 6 months, and established long-term monitoring program. Zero secondary environmental incidents during operation.',
                'start_date': date(2023, 3, 15),
                'completion_date': date(2023, 9, 30),
                'duration_months': 6,
                'project_value': 12500000.00,
                'environmental_impact': json.dumps({
                    'oil_recovered_percentage': 85,
                    'ecosystem_restoration_area_km2': 50,
                    'wildlife_rescued': 200,
                    'mangrove_replanted_hectares': 25
                }),
                'key_statistics': json.dumps({
                    'response_time_hours': 4,
                    'personnel_deployed': 150,
                    'equipment_units': 45,
                    'local_communities_engaged': 8
                }),
                'tags': 'oil spill response, environmental remediation, Niger Delta, emergency response',
                'status': 'COMPLETED',
                'featured_on_homepage': True,
                'display_order': 1
            },
            {
                'title': 'Chevron Nigeria Limited Offshore Platform Installation',
                'client': 'Chevron Nigeria Limited',
                'location': 'Offshore Lagos, Nigeria',
                'project_type': 'OFFSHORE',
                'brief_description': 'Installation and commissioning of offshore oil production platform including marine support services.',
                'detailed_description': 'Complete EPC project for offshore platform installation including structural engineering, equipment installation, testing, and commissioning. Provided specialized marine vessels and offshore accommodation.',
                'challenge': 'Complex offshore installation requiring precise positioning in 150-meter water depth with challenging weather conditions and strict safety requirements.',
                'solution': 'Utilized dynamic positioning vessels, advanced lifting equipment, and weather monitoring systems. Implemented comprehensive safety protocols and contingency planning.',
                'results': 'Platform successfully installed and commissioned on schedule with zero safety incidents. Achieved 99.8% operational efficiency within first year of operation.',
                'start_date': date(2022, 6, 1),
                'completion_date': date(2023, 2, 28),
                'duration_months': 9,
                'project_value': 45000000.00,
                'key_statistics': json.dumps({
                    'water_depth_meters': 150,
                    'platform_weight_tons': 2500,
                    'installation_accuracy_cm': 5,
                    'personnel_accommodated': 200
                }),
                'tags': 'offshore installation, EPC, marine services, platform commissioning',
                'status': 'COMPLETED',
                'featured_on_homepage': True,
                'display_order': 2
            },
            {
                'title': 'Nigerian National Petroleum Corporation Pipeline Construction',
                'client': 'Nigerian National Petroleum Corporation',
                'location': 'Warri to Kaduna, Nigeria',
                'project_type': 'CONSTRUCTION',
                'brief_description': 'Construction of 150km crude oil pipeline including pumping stations and monitoring systems.',
                'detailed_description': 'Engineering, procurement, and construction of high-pressure crude oil pipeline with automated monitoring systems, cathodic protection, and emergency shutdown capabilities.',
                'challenge': 'Pipeline route crossed multiple terrain types including swampland, rivers, and populated areas, requiring specialized construction techniques and community engagement.',
                'solution': 'Employed horizontal directional drilling for river crossings, specialized swamp construction techniques, and comprehensive stakeholder engagement program.',
                'results': 'Pipeline commissioned successfully with 99.9% integrity rating. Zero environmental incidents during construction and ongoing operations.',
                'start_date': date(2021, 9, 1),
                'completion_date': date(2023, 8, 31),
                'duration_months': 24,
                'project_value': 85000000.00,
                'environmental_impact': json.dumps({
                    'environmental_incidents': 0,
                    'communities_compensated': 25,
                    'restoration_hectares': 100,
                    'employment_created': 800
                }),
                'key_statistics': json.dumps({
                    'pipeline_length_km': 150,
                    'diameter_inches': 36,
                    'pumping_stations': 3,
                    'pressure_rating_psi': 1440
                }),
                'tags': 'pipeline construction, EPC, NNPC, infrastructure',
                'status': 'COMPLETED',
                'featured_on_homepage': True,
                'display_order': 3
            },
            {
                'title': 'Total Nigeria PLC Water Treatment Facility',
                'client': 'Total Nigeria PLC',
                'location': 'Port Harcourt, Rivers State',
                'project_type': 'ENVIRONMENTAL',
                'brief_description': 'Design and construction of advanced water treatment facility for produced water management.',
                'detailed_description': 'Complete design, supply, and installation of produced water treatment facility with capacity to process 50,000 barrels per day. Includes oil-water separation, chemical treatment, and water recycling systems.',
                'solution': 'Implemented advanced membrane technology, automated control systems, and real-time monitoring for optimal treatment efficiency and environmental compliance.',
                'results': 'Facility achieves 99.5% treatment efficiency, reduces water consumption by 60%, and meets all environmental discharge standards.',
                'start_date': date(2023, 1, 15),
                'completion_date': date(2024, 1, 15),
                'duration_months': 12,
                'project_value': 28000000.00,
                'environmental_impact': json.dumps({
                    'water_recycled_barrels_per_day': 30000,
                    'waste_reduction_percentage': 75,
                    'energy_efficiency_improvement': 40,
                    'environmental_compliance_rating': 100
                }),
                'tags': 'water treatment, environmental technology, produced water, recycling',
                'status': 'ONGOING',
                'featured_on_homepage': False,
                'display_order': 4
            }
        ]
        
        for proj_data in projects_data:
            project, created = ProjectPortfolio.objects.get_or_create(
                title=proj_data['title'],
                defaults={
                    'client': proj_data['client'],
                    'location': proj_data['location'],
                    'project_type': proj_data['project_type'],
                    'brief_description': proj_data['brief_description'],
                    'detailed_description': proj_data.get('detailed_description', ''),
                    'challenge': proj_data.get('challenge', ''),
                    'solution': proj_data.get('solution', ''),
                    'results': proj_data.get('results', ''),
                    'start_date': proj_data['start_date'],
                    'completion_date': proj_data.get('completion_date'),
                    'duration_months': proj_data.get('duration_months'),
                    'project_value': proj_data.get('project_value'),
                    'environmental_impact': proj_data.get('environmental_impact', '{}'),
                    'key_statistics': proj_data.get('key_statistics', '{}'),
                    'tags': proj_data.get('tags', ''),
                    'status': proj_data['status'],
                    'featured_on_homepage': proj_data['featured_on_homepage'],
                    'display_order': proj_data['display_order']
                }
            )
            self.stdout.write(f"{'Created' if created else 'Updated'} project: {project.title}")

    def create_company_milestones(self):
        """Create company milestone records"""
        milestones_data = [
            {
                'title': 'Company Incorporation',
                'description': 'Axflo Oil and Gas Nigeria Limited was officially incorporated as a limited liability company, marking the beginning of our journey in the Nigerian oil and gas industry.',
                'milestone_date': date(2008, 3, 15),
                'icon': 'fa-flag',
                'featured': True,
                'display_order': 1
            },
            {
                'title': 'First Major Oil Spill Response Contract',
                'description': 'Successfully completed our first major oil spill response operation in the Niger Delta, establishing our reputation as a reliable environmental response contractor.',
                'milestone_date': date(2009, 8, 20),
                'icon': 'fa-shield-alt',
                'featured': True,
                'display_order': 2
            },
            {
                'title': 'ISO 9001:2008 Quality Certification',
                'description': 'Achieved ISO 9001:2008 certification, demonstrating our commitment to quality management systems and continuous improvement.',
                'milestone_date': date(2011, 5, 10),
                'icon': 'fa-certificate',
                'featured': False,
                'display_order': 3
            },
            {
                'title': 'Offshore Marine Services Launch',
                'description': 'Expanded operations to include comprehensive offshore marine services, including vessel operations, accommodation services, and offshore support.',
                'milestone_date': date(2013, 11, 30),
                'icon': 'fa-ship',
                'featured': True,
                'display_order': 4
            },
            {
                'title': '100th Successful Project Completion',
                'description': 'Celebrated the successful completion of our 100th project, demonstrating consistent delivery excellence and client satisfaction.',
                'milestone_date': date(2016, 9, 15),
                'icon': 'fa-trophy',
                'featured': True,
                'display_order': 5
            },
            {
                'title': 'Advanced Technology Center Opening',
                'description': 'Opened our state-of-the-art technology center in Port Harcourt, enhancing our engineering capabilities and research and development activities.',
                'milestone_date': date(2018, 4, 25),
                'icon': 'fa-cogs',
                'featured': False,
                'display_order': 6
            },
            {
                'title': 'First Zero-Emission Project',
                'description': 'Completed our first carbon-neutral project, pioneering sustainable practices in the Nigerian oil and gas industry.',
                'milestone_date': date(2020, 12, 5),
                'icon': 'fa-leaf',
                'featured': True,
                'display_order': 7
            },
            {
                'title': '15 Years of Excellence',
                'description': 'Celebrated 15 years of outstanding service in the Nigerian oil and gas industry, marked by numerous awards and industry recognition.',
                'milestone_date': date(2023, 3, 15),
                'icon': 'fa-birthday-cake',
                'featured': True,
                'display_order': 8
            },
            {
                'title': '2 Million Safe Work Hours Achievement',
                'description': 'Achieved the remarkable milestone of 2 million safe work hours without a Lost Time Injury, setting new industry safety standards.',
                'milestone_date': date(2024, 1, 20),
                'icon': 'fa-hard-hat',
                'featured': True,
                'display_order': 9
            }
        ]
        
        for milestone_data in milestones_data:
            milestone, created = CompanyMilestone.objects.get_or_create(
                title=milestone_data['title'],
                defaults={
                    'description': milestone_data['description'],
                    'milestone_date': milestone_data['milestone_date'],
                    'icon': milestone_data['icon'],
                    'featured': milestone_data['featured'],
                    'display_order': milestone_data['display_order']
                }
            )
            self.stdout.write(f"{'Created' if created else 'Updated'} milestone: {milestone.title}")