from django.urls import path

from .views import AdminsView, MentorsView, StatisticViews

urlpatterns = [
    path('mentors/<int:id>', MentorsView.as_view()),
    path('admins/<int:id>', AdminsView.as_view()),
    path('admins/', AdminsView.as_view()),
    path('statistics/<type>/<int:id>', StatisticViews.as_view())
]
