from .shared_settings import *
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'Baytree',
        'USER': 'Baytree',
        'PASSWORD': 'Baytree123',
        'HOST': '127.0.0.1',  
        'PORT': '3306',
    }
}