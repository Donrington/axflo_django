from django import forms
from django.core.exceptions import ValidationError
from django.forms.widgets import CheckboxSelectMultiple
from .models import Newsletter, SubscriptionCategory, Subscriber

class CategoryCheckboxSelectMultiple(CheckboxSelectMultiple):
    """Custom widget for category selection with subscriber counts"""
    
    def create_option(self, name, value, label, selected, index, subindex=None, attrs=None):
        option = super().create_option(name, value, label, selected, index, subindex, attrs)
        
        if value:
            try:
                category = SubscriptionCategory.objects.get(pk=value)
                subscriber_count = Subscriber.objects.filter(
                    interests=category,
                    active_status=True
                ).count()
                option['subscriber_count'] = subscriber_count
            except SubscriptionCategory.DoesNotExist:
                option['subscriber_count'] = 0
        else:
            option['subscriber_count'] = 0
            
        return option

class NewsletterCreateForm(forms.ModelForm):
    """Dynamic form for creating newsletters with custom fields and validation"""
    
    # Custom fields not in the model
    
    template_type = forms.ChoiceField(
        choices=[
            ('basic', 'Basic Newsletter'),
            ('announcement', 'Company Announcement'),
            ('project_update', 'Project Update'),
            ('safety_alert', 'Safety Alert'),
            ('technical_insight', 'Technical Insight'),
        ],
        widget=forms.Select(attrs={
            'class': 'form-control',
            'id': 'template'
        }),
        initial='basic',
        help_text="Choose a template that matches your content type"
    )
    
    send_option = forms.ChoiceField(
        choices=[
            ('draft', 'Save as Draft'),
            ('immediate', 'Send Immediately'),
            ('scheduled', 'Schedule for Later'),
        ],
        widget=forms.RadioSelect(attrs={
            'class': 'send-option-radio'
        }),
        initial='draft',
        help_text="Choose when to send your newsletter"
    )
    
    send_date = forms.DateField(
        widget=forms.DateInput(attrs={
            'type': 'date',
            'class': 'form-control',
            'id': 'send_date'
        }),
        required=False,
        help_text="Required if scheduling for later"
    )
    
    send_time = forms.TimeField(
        widget=forms.TimeInput(attrs={
            'type': 'time',
            'class': 'form-control',
            'id': 'send_time'
        }),
        required=False,
        help_text="Required if scheduling for later"
    )
    
    send_test = forms.BooleanField(
        widget=forms.CheckboxInput(attrs={
            'class': 'checkbox-custom',
            'id': 'sendTest'
        }),
        required=False,
        help_text="Send test email to myself first"
    )
    
    track_opens = forms.BooleanField(
        widget=forms.CheckboxInput(attrs={
            'class': 'checkbox-custom',
            'id': 'trackOpens'
        }),
        initial=True,
        required=False,
        help_text="Track email opens"
    )
    
    track_clicks = forms.BooleanField(
        widget=forms.CheckboxInput(attrs={
            'class': 'checkbox-custom',
            'id': 'trackClicks'
        }),
        initial=True,
        required=False,
        help_text="Track link clicks"
    )

    class Meta:
        model = Newsletter
        fields = ['title', 'content', 'categories']
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'form-control',
                'id': 'title',
                'placeholder': 'Enter newsletter title (this will be the email subject)',
                'required': True
            }),
            'content': forms.Textarea(attrs={
                'class': 'form-control rich-editor',
                'id': 'content',
                'placeholder': 'Write your newsletter content here...',
                'required': True
            }),
            'categories': CategoryCheckboxSelectMultiple(attrs={
                'class': 'category-checkbox-input'
            })
        }
        help_texts = {
            'title': 'This will be used as the email subject line',
            'content': 'Use the rich text editor to format your content with headings, lists, links, and images',
            'categories': 'Select categories to target specific subscriber groups'
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Add required attribute to title field
        self.fields['title'].required = True
        self.fields['content'].required = True
        
        # Add CSS classes for styling
        for field_name, field in self.fields.items():
            if hasattr(field.widget, 'attrs'):
                field.widget.attrs.setdefault('class', 'form-control')

    def clean(self):
        cleaned_data = super().clean()
        send_option = cleaned_data.get('send_option')
        send_date = cleaned_data.get('send_date')
        send_time = cleaned_data.get('send_time')
        
        # Validate scheduling fields
        if send_option == 'scheduled':
            if not send_date:
                raise ValidationError({
                    'send_date': 'Send date is required when scheduling for later.'
                })
            if not send_time:
                raise ValidationError({
                    'send_time': 'Send time is required when scheduling for later.'
                })
        
        return cleaned_data

    def clean_title(self):
        title = self.cleaned_data.get('title')
        if not title or not title.strip():
            raise ValidationError('Newsletter title is required.')
        return title.strip()

    def clean_content(self):
        content = self.cleaned_data.get('content')
        if not content or not content.strip():
            raise ValidationError('Newsletter content is required.')
        return content.strip()