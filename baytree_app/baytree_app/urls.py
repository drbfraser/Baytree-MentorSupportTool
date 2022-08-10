from django.contrib import admin
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.urls import include, path

from .views import (CookieTokenObtainPairView, CookieTokenRefreshView,
                    CookieTokenVerifyView, logout_view)

api_patterns = [
    path('sessions/', include('sessions.urls')),
    path('records/', include('records.urls')),
    path('resources/', include('resources.urls')),
    path('users/', include('users.urls')),
    path('questionnaires/', include('questionnaires.urls')),
    path('views-api/', include('views_api.urls')),
    path('goals', include('goals.urls')),
    path('calendar_events/', include('calendar_events.urls')),
    path('notifications/', include('notifications.urls')),
    path('logging/', include('app_logging.urls')),
    path('preferences/', include('preferences.urls')),
    path('token/', CookieTokenObtainPairView.as_view()),
    path('token/refresh/', CookieTokenRefreshView.as_view()),
    path('token/verify/', CookieTokenVerifyView.as_view()),
    path('token/logout/', logout_view),
]

urlpatterns = [
    path("api/", include(api_patterns)),
]

urlpatterns += staticfiles_urlpatterns()
admin.site.index_title = ""
admin.site.site_header = "The Baytree Center"
admin.site.site_title = "The Baytree Center Administration"
