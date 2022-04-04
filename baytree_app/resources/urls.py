from django.urls import path
from .views import ResourceView

urlpatterns = [
    path('', ResourceView.as_view())
]
