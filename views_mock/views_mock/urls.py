from django.contrib import admin
from django.urls import path
from .views import get_volunteering_types_endpoint

urlpatterns = [
    path('admin/', admin.site.urls),
    path('/api/views-api/volunteers/volunteer', get_volunteering_types_endpoint)
]
