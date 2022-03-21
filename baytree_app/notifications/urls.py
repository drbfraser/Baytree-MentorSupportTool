from django.urls import path

from .views import NotificationViews

urlpatterns = [
    path('', NotificationViews.as_view()),
    path('<int:mentor_id>', NotificationViews.as_view()),
    path('get_unread_count/<int:mentor_id>', NotificationViews.get_unread_notification_count)
]