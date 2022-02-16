from .shared_settings import *
ALLOWED_HOSTS = ["172.19.0.3", "localhost"]
DEBUG = False

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'Baytree',
        'USER': 'Baytree',
        'PASSWORD': 'Baytree123',
        'HOST': '172.19.0.2',  
        'PORT': '3306',
    }
}