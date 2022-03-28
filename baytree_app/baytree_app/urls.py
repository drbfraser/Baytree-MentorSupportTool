from django.contrib import admin
from django.urls import path, include, re_path
from admin_login.admin import blog_site
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.contrib.auth import views as auth_views

from .views import CookieTokenObtainPairView, CookieTokenRefreshView, CookieTokenVerifyView, logout_view


api_patterns = [
    path('sessions/', include('sessions.urls')),
    path('records/', include('records.urls')),
    path('resources/', include('resources.urls')),
    path('users/', include('users.urls')),
    path('questionnaires/', include('questionnaires.urls')),
    path('questions/', include('questions_and_answers.urls')),
    path('views-api/', include('views_api.urls')),
    path('goals/', include('goals.urls')),
    path('notifications/', include('notifications.urls')),
    path('token/', CookieTokenObtainPairView.as_view()),
    path('token/refresh/', CookieTokenRefreshView.as_view()),
    path('token/verify/', CookieTokenVerifyView.as_view()),
    path('token/logout/', logout_view),
]

password_patterns = [
    # Password reset links (ref: https://github.com/django/django/blob/master/django/contrib/auth/views.py)
    path('password_change/done/', auth_views.PasswordChangeDoneView.as_view(template_name='password_reset/password_change_done.html'), 
    name='password_change_done'),

    path('password_change/', auth_views.PasswordChangeView.as_view(template_name='password_reset/password_change.html'), 
    name='password_change'),

    path('password_reset/done/', auth_views.PasswordResetCompleteView.as_view(template_name='password_reset/password_reset_done.html'),
    name='password_reset_done'),

    path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('password_reset/', auth_views.PasswordResetView.as_view(), name='password_reset'),
    
    path('reset/done/', auth_views.PasswordResetCompleteView.as_view(template_name='password_reset/password_reset_complete.html'),
    name='password_reset_complete'),
]

urlpatterns = [
    path("api/", include(api_patterns)),
    # remove once all admin and password functionality is implemented in the React frontends
    path("backend/admin/", admin.site.urls),
    path("backend/password/", include(password_patterns)),
]

urlpatterns += staticfiles_urlpatterns()
admin.site.index_title = ""
admin.site.site_header = "The Baytree Center"
admin.site.site_title = "The Baytree Center Administration"