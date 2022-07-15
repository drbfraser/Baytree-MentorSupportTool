from django.urls import path
from .views import get_resource

urlpatterns = [
    path('', get_resource)
]
