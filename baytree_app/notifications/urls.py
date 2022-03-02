from django.urls import path

from .views import NotificationViews

urlpatterns = [
    path('', NotificationViews.as_view()),
    path('<int:mentor_id>', NotificationViews.as_view())
]