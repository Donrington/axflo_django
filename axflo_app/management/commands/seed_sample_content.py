from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone
from axflo_app.models import NewsArticle, BlogCategory
from datetime import timedelta

class Command(BaseCommand):
    help = 'Seed sample blog content for testing the news section'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('🔄 Seeding sample blog content...\n'))
        
        # Ensure we have a default user for articles
        admin_user, _ = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@axflo.com',
                'is_staff': True,
                'is_superuser': True
            }
        )
        
        # Get or create categories
        company_news, _ = BlogCategory.objects.get_or_create(
            name='Company News',
            defaults={
                'description': 'Latest company announcements and updates',
                'slug': 'company-news'
            }
        )
        
        industry_insights, _ = BlogCategory.objects.get_or_create(
            name='Industry Insights',
            defaults={
                'description': 'Industry analysis and market trends',
                'slug': 'industry-insights'
            }
        )
        
        project_updates, _ = BlogCategory.objects.get_or_create(
            name='Project Updates',
            defaults={
                'description': 'Updates on ongoing and completed projects',
                'slug': 'project-updates'
            }
        )
        
        # Sample articles
        sample_articles = [
            {
                'title': 'Axflo Successfully Completes Major LNG Terminal Project in Lagos',
                'slug': 'axflo-completes-lng-terminal-lagos',
                'excerpt': 'Axflo Oil and Gas has successfully delivered a world-class LNG terminal facility in Lagos, marking a significant milestone in Nigeria\'s energy infrastructure development.',
                'content': '''
                <p>Axflo Oil and Gas is proud to announce the successful completion of the Lagos LNG Terminal Project, a groundbreaking infrastructure development that positions Nigeria as a key player in the global liquefied natural gas market.</p>
                
                <h3>Project Highlights</h3>
                <p>The $2.8 billion facility spans over 150 hectares and includes:</p>
                <ul>
                    <li>Two 180,000 cubic meter LNG storage tanks</li>
                    <li>State-of-the-art loading and unloading facilities</li>
                    <li>Advanced safety and environmental monitoring systems</li>
                    <li>Marine terminal with two berthing facilities</li>
                </ul>
                
                <h3>Engineering Excellence</h3>
                <p>Our engineering team overcame significant technical challenges, including:</p>
                <ul>
                    <li>Soft soil conditions requiring specialized foundation solutions</li>
                    <li>Integration with existing port infrastructure</li>
                    <li>Compliance with international safety standards</li>
                    <li>Environmental impact minimization</li>
                </ul>
                
                <p>This project showcases Axflo's capability to deliver complex EPC projects on time and within budget, reinforcing our position as Nigeria's premier oil and gas contractor.</p>
                ''',
                'category': company_news,
                'featured': True,
                'status': 'PUBLISHED',
                'published_at': timezone.now() - timedelta(days=2),
                'image_url': '/static/axflo_app/images/plan1.jpg',
                'image_alt': 'LNG Terminal Construction',
                'meta_description': 'Axflo completes major LNG terminal project in Lagos, advancing Nigeria\'s energy infrastructure with world-class facilities.',
                'tags': 'LNG, terminal, Lagos, infrastructure, engineering',
                'view_count': 245
            },
            {
                'title': 'The Future of Offshore Wind in West Africa: Opportunities and Challenges',
                'slug': 'offshore-wind-west-africa-opportunities',
                'excerpt': 'Exploring the potential of offshore wind energy in West Africa and how Axflo is positioning itself to capitalize on this emerging market opportunity.',
                'content': '''
                <p>As the global energy transition accelerates, West Africa is emerging as a promising frontier for offshore wind development. With its extensive coastline and favorable wind conditions, the region presents significant opportunities for renewable energy expansion.</p>
                
                <h3>Market Potential</h3>
                <p>Recent studies indicate that West Africa has the technical potential to generate over 200 GW of offshore wind capacity. Countries like Ghana, Senegal, and Nigeria are leading the charge with supportive policies and international partnerships.</p>
                
                <h3>Axflo's Strategic Position</h3>
                <p>Drawing on our extensive offshore experience, Axflo is well-positioned to support the offshore wind sector through:</p>
                <ul>
                    <li>Marine engineering and installation services</li>
                    <li>Offshore logistics and support vessels</li>
                    <li>Environmental impact assessment and monitoring</li>
                    <li>Local content development and training</li>
                </ul>
                
                <h3>Challenges and Solutions</h3>
                <p>While opportunities abound, several challenges must be addressed:</p>
                <ul>
                    <li><strong>Grid Infrastructure:</strong> Upgrading transmission networks to handle intermittent renewable power</li>
                    <li><strong>Local Capacity:</strong> Developing skilled workforce and supply chains</li>
                    <li><strong>Financing:</strong> Attracting investment for large-scale projects</li>
                    <li><strong>Regulatory Framework:</strong> Establishing clear policies and procedures</li>
                </ul>
                
                <p>Axflo is actively engaging with governments and international partners to address these challenges and unlock the region's offshore wind potential.</p>
                ''',
                'category': industry_insights,
                'featured': False,
                'status': 'PUBLISHED',
                'published_at': timezone.now() - timedelta(days=5),
                'image_url': '/static/axflo_app/images/axflo15.jpg',
                'image_alt': 'Offshore wind turbines',
                'meta_description': 'Analysis of offshore wind opportunities in West Africa and Axflo\'s strategic positioning in the renewable energy sector.',
                'tags': 'offshore wind, renewable energy, West Africa, sustainability',
                'view_count': 189
            },
            {
                'title': 'Axflo Invests $50M in Advanced Marine Fleet Expansion',
                'slug': 'axflo-marine-fleet-expansion-50m',
                'excerpt': 'Axflo announces significant investment in expanding its marine fleet with cutting-edge vessels to support growing offshore operations across West Africa.',
                'content': '''
                <p>Axflo Oil and Gas has announced a $50 million investment program to expand and modernize its marine fleet, reinforcing our commitment to providing world-class offshore support services across West Africa.</p>
                
                <h3>Fleet Expansion Details</h3>
                <p>The investment includes:</p>
                <ul>
                    <li>Three new Platform Supply Vessels (PSVs) with DP2 capability</li>
                    <li>Two Fast Supply Intervention Vessels (FSIVs)</li>
                    <li>One multi-purpose construction support vessel</li>
                    <li>Advanced crew transfer vessels for wind farm operations</li>
                </ul>
                
                <h3>Technology and Innovation</h3>
                <p>Our new vessels feature:</p>
                <ul>
                    <li>Hybrid propulsion systems reducing emissions by 30%</li>
                    <li>Advanced dynamic positioning systems</li>
                    <li>State-of-the-art safety and navigation equipment</li>
                    <li>Enhanced accommodation facilities for crew comfort</li>
                </ul>
                
                <h3>Strategic Impact</h3>
                <p>This expansion will:</p>
                <ul>
                    <li>Increase our operational capacity by 40%</li>
                    <li>Enable support for deeper water operations</li>
                    <li>Position us for renewable energy projects</li>
                    <li>Create 150 new maritime jobs</li>
                </ul>
                
                <p>The first vessels are expected to enter service in Q3 2025, with the full fleet operational by early 2026.</p>
                ''',
                'category': company_news,
                'featured': False,
                'status': 'PUBLISHED',
                'published_at': timezone.now() - timedelta(days=7),
                'image_url': '/static/axflo_app/images/axflo20.jpg',
                'image_alt': 'Modern offshore support vessel',
                'meta_description': 'Axflo invests $50M in marine fleet expansion with advanced vessels for offshore operations in West Africa.',
                'tags': 'marine fleet, investment, offshore, vessels, expansion',
                'view_count': 312
            },
            {
                'title': 'Digital Transformation in Oil & Gas: Axflo\'s IoT Implementation Success',
                'slug': 'digital-transformation-iot-success',
                'excerpt': 'How Axflo is leveraging IoT technology and data analytics to optimize operations, improve safety, and reduce environmental impact across our projects.',
                'content': '''
                <p>In an era of rapid digital transformation, Axflo Oil and Gas is leading the charge in implementing cutting-edge Internet of Things (IoT) solutions across our operations. Our comprehensive digital strategy is delivering measurable improvements in efficiency, safety, and environmental performance.</p>
                
                <h3>IoT Implementation Overview</h3>
                <p>Over the past 18 months, we have deployed over 2,000 IoT sensors across our facilities, monitoring:</p>
                <ul>
                    <li>Equipment performance and predictive maintenance</li>
                    <li>Environmental parameters and emissions</li>
                    <li>Personnel safety and location tracking</li>
                    <li>Energy consumption and optimization</li>
                </ul>
                
                <h3>Key Results</h3>
                <p>Our digital transformation has achieved:</p>
                <ul>
                    <li><strong>25% reduction</strong> in unplanned downtime</li>
                    <li><strong>30% improvement</strong> in energy efficiency</li>
                    <li><strong>40% faster</strong> emergency response times</li>
                    <li><strong>15% reduction</strong> in operational costs</li>
                </ul>
                
                <h3>Advanced Analytics</h3>
                <p>Our data analytics platform processes over 10TB of operational data daily, providing insights for:</p>
                <ul>
                    <li>Predictive maintenance scheduling</li>
                    <li>Risk assessment and mitigation</li>
                    <li>Performance optimization</li>
                    <li>Environmental compliance monitoring</li>
                </ul>
                
                <h3>Future Roadmap</h3>
                <p>Phase 2 of our digital transformation includes:</p>
                <ul>
                    <li>Artificial Intelligence for autonomous operations</li>
                    <li>Digital twin technology for major facilities</li>
                    <li>Blockchain for supply chain transparency</li>
                    <li>Augmented reality for maintenance and training</li>
                </ul>
                
                <p>This digital foundation positions Axflo as a technology leader in the West African oil and gas sector.</p>
                ''',
                'category': industry_insights,
                'featured': False,
                'status': 'PUBLISHED',
                'published_at': timezone.now() - timedelta(days=10),
                'image_url': '/static/axflo_app/images/axflo25.jpg',
                'image_alt': 'Digital oil and gas operations',
                'meta_description': 'Axflo\'s successful IoT implementation delivers improved efficiency, safety, and environmental performance.',
                'tags': 'IoT, digital transformation, analytics, technology, efficiency',
                'view_count': 156
            }
        ]
        
        created_count = 0
        
        for article_data in sample_articles:
            article, created = NewsArticle.objects.get_or_create(
                slug=article_data['slug'],
                defaults={
                    'title': article_data['title'],
                    'excerpt': article_data['excerpt'],
                    'content': article_data['content'],
                    'category': article_data['category'],
                    'author': admin_user,
                    'featured': article_data['featured'],
                    'status': article_data['status'],
                    'published_at': article_data['published_at'],
                    'image_url': article_data['image_url'],
                    'image_alt': article_data['image_alt'],
                    'meta_description': article_data['meta_description'],
                    'tags': article_data['tags'],
                    'view_count': article_data['view_count']
                }
            )
            
            if created:
                created_count += 1
                self.stdout.write(f'  ✓ Created article: {article.title}')
        
        self.stdout.write(
            self.style.SUCCESS(
                f'\n✅ Sample content seeding completed!\n'
                f'Created: {created_count} articles\n'
                f'Total articles: {NewsArticle.objects.count()}\n'
                f'Total categories: {BlogCategory.objects.count()}'
            )
        )