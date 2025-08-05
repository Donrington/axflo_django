"""
Context processors for the axflo_app
"""

def admin_context(request):
    """
    Add admin-specific context variables to all templates
    """
    # Get the current path to determine active navigation
    current_path = request.path
    current_page = 'dashboard'  # default
    
    # Map URLs to page identifiers for sidebar active states
    if '/admin-careers/' in current_path or '/admin-career' in current_path:
        current_page = 'careers'
    elif '/admin-applications/' in current_path or '/admin-application' in current_path:
        current_page = 'applications'
    elif '/admin-users/' in current_path:
        current_page = 'users'
    elif '/admin-contacts/' in current_path or '/admin-contact' in current_path:
        current_page = 'contacts'
    elif '/admin-subscribers/' in current_path:
        current_page = 'subscribers'
    elif '/admindashboard/' in current_path:
        current_page = 'dashboard'
    
    return {
        'current_page': current_page,
        'current_path': current_path,
    }