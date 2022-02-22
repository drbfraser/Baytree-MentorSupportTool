from email.policy import EmailPolicy
from .base_settings import *
import environ
# Initialise environment variables
env = environ.Env()

# Set the project base directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Take environment variables from .env file
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# Email env vars
EMAIL_BACKEND = env("EMAIL_BACKEND_DEV")
EMAIL_HOST = env("EMAIL_HOST_DEV")
EMAIL_PORT = env("EMAIL_PORT_DEV")
EMAIL_USE_TLS = env("EMAIL_USE_TLS_DEV")
EMAIL_USER = env("EMAIL_USER_DEV")
EMAIL_PASSWORD = env("EMAIL_PASSWORD_DEV")

# Database env vars
DATABASE_ENGINE = env("DATABASE_ENGINE_DEV")
DATABASE_NAME = env("DATABASE_NAME_DEV")
DATABASE_USER = env("DATABASE_USER_DEV")
DATABASE_PASSWORD = env("DATABASE_PASSWORD_DEV")
DATABASE_HOST = env("DATABASE_HOST_DEV")
DATABASE_PORT = env("DATABASE_PORT_DEV")

# Secret key env var
SECRET_KEY = env("DJANGO_SECRET_KEY_DEV")

DATABASES = {
    'default': {
        'ENGINE': DATABASE_ENGINE,
        'NAME': DATABASE_NAME,
        'USER': DATABASE_USER,
        'PASSWORD': DATABASE_PASSWORD,
        'HOST': DATABASE_HOST,  
        'PORT': DATABASE_PORT,
    }
}