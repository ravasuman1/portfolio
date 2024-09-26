# myapp/expectations.py

from rest_framework.exceptions import ValidationError

def format_errors(errors):
    """Format the errors returned from DRF validation."""
    formatted_errors = {}
    
    for field, messages in errors.items():
        if isinstance(messages, list):
            formatted_errors[field] = messages
        else:
            formatted_errors[field] = [messages]

    return formatted_errors
