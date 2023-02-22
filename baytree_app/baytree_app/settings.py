"""
Django settings for baytree_app project.

Generated by 'django-admin startproject' using Django 3.2.7.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.2/ref/settings/
"""
import logging
from datetime import timedelta
from pathlib import Path
import os
from pythonjsonlogger import jsonlogger

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

DEBUG = os.environ.get("DEBUG", "") == "yes"
SECRET_KEY = os.environ["SECRET_KEY"]

if DEBUG:
    ALLOWED_HOSTS = ["localhost"]
    CORS_ALLOW_ALL_ORIGINS = True
    CORS_ALLOW_CREDENTIALS = True
else:
    ALLOWED_HOSTS = [os.environ["DOMAIN"]]
    CORS_ALLOW_ALL_ORIGINS = False
    USE_X_FORWARDED_HOST = True
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

LOGGING = {
    "version": 1,
    "disable_existing_loggers": True,
    'formatters': {
        'json': {
            '()': jsonlogger.JsonFormatter,
            'format': '%(asctime)s %(levelname)s %(message)s'
        }
    },
    "handlers": {
        # Log application logs into server_application
        "application": {
            "class": "logging.FileHandler",
            "filename": os.path.join(BASE_DIR, "server_logs/server_application.log"),
            "level": logging.DEBUG,
            "formatter": "json"
        },
        # console only logs warning and error message
        "console": {
            "class": "logging.StreamHandler",
            "level": logging.WARNING,
            "formatter": "json"
        },
        # log to fluent bit
        "fluent": {
            "class": "fluent.handler.FluentHandler",
            "tag": "django",
            "host": "http://fluent-bit:24223/" if not os.environ.get("LOGGING_URL") else os.environ.get("LOGGING_URL"),
            "port": 24224,
            "formatter": "json"
        },
        # Log server requests received to server_requests.log
        "requests": {
            "class": "logging.FileHandler",
            "filename": os.path.join(BASE_DIR, "server_logs/server_requests.log"),
            "level": logging.DEBUG,
            "formatter": "json"
        },
        # Log security errors to server_security.log
        "security_errors": {
            "class": "logging.FileHandler",
            "filename": os.path.join(BASE_DIR, "server_logs/server_security.log"),
            "level": logging.INFO,
            "formatter": "json"
        },
    },
    "loggers": {
        # Server message
        "django": {
            "handlers": ["application", "console", "fluent"],
            "level": logging.INFO
        },
        # Server requests
        "django.request": {
            "handlers": ["requests", "console", "fluent"],
            "level": logging.DEBUG,
            "propagate": False
        },
        # Server messages
        "django_message": {
            "handlers": ["application", "fluent"],
            "level": logging.DEBUG
        },
        # Security
        "django.security.*": {
            "handlers": ["security_errors", "console", "fluent"],
            "level": logging.INFO,
            "propagate": False
        },
    },
}

# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "rest_framework",
    "rest_framework.authtoken",
    "django.contrib.sites",
    "emails",
    "questionnaires",
    "questions_and_answers",
    "sessions",
    "admin_login",
    "goals",
    "notifications",
    "crispy_forms",
    "django_filters",
    "views_api",
    "records",
    "calendar_events",
    "preferences",
    "app_logging",
    "cronjobs",
    "users"
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "baytree_app.middleware.LoggingMiddleware",
    "baytree_app.middleware.AccessTokenMiddleware"
]

ROOT_URLCONF = "baytree_app.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [os.path.join(BASE_DIR, "templates")],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "baytree_app.wsgi.application"

# Password validation
# https://docs.djangoproject.com/en/3.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# Internationalization
# https://docs.djangoproject.com/en/3.2/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "America/Vancouver"

USE_I18N = True

USE_L10N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.2/howto/static-files/

STATIC_URL = "/static/"
STATICFILES_DIRS = [os.path.join(BASE_DIR, "static")]

# Default primary key field type
# https://docs.djangoproject.com/en/3.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

APPEND_SLASH = False

AUTH_USER_MODEL = "users.CustomUser"

ACCOUNT_USER_MODEL_USERNAME_FIELD = None
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_UNIQUE_EMAIL = True
ACCOUNT_USERNAME_REQUIRED = False
ACCOUNT_AUTHENTICATION_METHOD = "email"
ACCOUNT_EMAIL_VERIFICATION = "none"
ACCOUNT_CONFIRM_EMAIL_ON_GET = True
ACCOUNT_EMAIL_CONFIRMATION_ANONYMOUS_REDIRECT_URL = "/?verification=1"
ACCOUNT_EMAIL_CONFIRMATION_AUTHENTICATED_REDIRECT_URL = "/?verification=1"

REST_AUTH_SERIALIZERS = {
    "USER_DETAILS_SERIALIZER": "users.serializers.UserSerializer",
}

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "baytree_app.auth_class.CookieJWTAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    "DEFAULT_FILTER_BACKENDS": ["django_filters.rest_framework.DjangoFilterBackend"],
    "DEFAULT_RENDERER_CLASSES": ["rest_framework.renderers.JSONRenderer"],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.LimitOffsetPagination",
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=30),
    "REFRESH_TOKEN_LIFTIME": timedelta(days=1),
    "ROTATE_REFRESH_TOKENS": False,
    "AUTH_HEADER_TYPES": ("Bearer",),
    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",),
}

SITE_ID = 1

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_USE_TLS = True
EMAIL_HOST = os.environ["EMAIL_HOST"]
EMAIL_PORT = os.environ["EMAIL_PORT"]
EMAIL_USER = os.environ["EMAIL_USER"]
EMAIL_HOST_USER = os.environ["EMAIL_USER"]
EMAIL_HOST_PASSWORD = os.environ["EMAIL_PASSWORD"]
EMAIL_PASSWORD = os.environ["EMAIL_PASSWORD"]
DEFAULT_FROM_EMAIL = os.environ["EMAIL_USER"]
SERVER_EMAIL = os.environ["EMAIL_USER"]
os.environ.setdefault("VIEWS_BASE_URL", "http://views-mock:5001/")

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": os.environ["MYSQL_DATABASE"],
        "USER": os.environ["MYSQL_USER"],
        "PASSWORD": os.environ["MYSQL_PASSWORD"],
        "HOST": os.environ["MYSQL_HOST"],
        "PORT": 3306,
    }
}

CELERY_BROKER_URL = os.environ.get("CELERY_BROKER_URL", "")
CELERY_RESULT_BACKEND = os.environ.get("CELERY_BACKEND_URL", "")
