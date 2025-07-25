"""
WSGI config for faceid_factory project.
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'faceid_factory.settings')

application = get_wsgi_application()