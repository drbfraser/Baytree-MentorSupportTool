from .base_settings import *
import environ
# Initialise environment variables
env = environ.Env()

# Set the project base directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Take environment variables from .env file
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))

ALLOWED_HOSTS = ["172.19.0.3", "localhost"]

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

# Email env vars
EMAIL_BACKEND = env("EMAIL_BACKEND_PROD")
EMAIL_HOST = env("EMAIL_HOST_PROD")
EMAIL_PORT = env("EMAIL_PORT_PROD")
EMAIL_USE_TLS = env("EMAIL_USE_TLS_PROD")
EMAIL_USER = env("EMAIL_USER_PROD")
EMAIL_PASSWORD = env("EMAIL_PASSWORD_PROD")

# Database env vars
DATABASE_ENGINE = env("DATABASE_ENGINE_PROD")
DATABASE_NAME = env("DATABASE_NAME_PROD")
DATABASE_USER = env("DATABASE_USER_PROD")
DATABASE_PASSWORD = env("DATABASE_PASSWORD_PROD")
DATABASE_HOST = env("DATABASE_HOST_PROD")
DATABASE_PORT = env("DATABASE_PORT_PROD")

# Secret key env var
SECRET_KEY = env("DJANGO_SECRET_KEY_PROD")

DATABASES = {
    'default': {
        'ENGINE': DATABASE_ENGINE,
        'NAME': DATABASE_NAME,
        'USER': DATABASE_USER,
        'PASSWORD': DATABASE_PASSWORD,
        'HOST': DATABASE_HOST,
        'PORT': DATABASE_PORT
    }
}