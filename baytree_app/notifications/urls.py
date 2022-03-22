from django.urls import path

from .views import NotificationViews, get_unread_notification_count

urlpatterns = [
    path('', NotificationViews.as_view()),
    path('<int:notification_id>', NotificationViews.as_view()),
    path('get_unread_count/', get_unread_notification_count)
]