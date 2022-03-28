from django.urls import path
from .views import ResourceView

urlpatterns = [
    path('<int:id>', ResourceView.as_view())
]
