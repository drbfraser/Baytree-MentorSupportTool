from django.contrib import admin
from django.urls import path, include, re_path
from admin_login.admin import blog_site
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.contrib.auth import views as auth_views

from .views import CookieTokenObtainPairView, CookieTokenRefreshView, CookieTokenVerifyView, logout_view


urlpatterns = [
    path('admin/', admin.site.urls),
    path('sessions/', include('sessions.urls')),
    path('records/', include('records.urls')),
    path('users/', include('users.urls')),
    path('questionnaires/', include('questionnaires.urls')),
    path('questions/', include('questions_and_answers.urls')),
    path('goals/', include('goals.urls')),
    path('api/token/', CookieTokenObtainPairView.as_view()),
    path('api/token/refresh/', CookieTokenRefreshView.as_view()),
    path('api/token/verify/', CookieTokenVerifyView.as_view()),
    path('api/token/logout/', logout_view),
    # path('accounts/', include('django.contrib.auth.urls')),
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
]+ static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

urlpatterns += staticfiles_urlpatterns()
admin.site.index_title = ""
admin.site.site_header = "The Baytree Center"
admin.site.site_title = "The Baytree Center Administration"