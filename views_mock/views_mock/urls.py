from django.urls import include, path

from .views import (CookieTokenObtainPairView, CookieTokenRefreshView,
                    CookieTokenVerifyView)
urlpatterns = [
    path('', include('views_api.urls')),
    path('api/token/', CookieTokenObtainPairView.as_view()),
    path('token/refresh/', CookieTokenRefreshView.as_view()),
    path('token/verify/', CookieTokenVerifyView.as_view()),
    # path('token/logout/', logout_view),
]
