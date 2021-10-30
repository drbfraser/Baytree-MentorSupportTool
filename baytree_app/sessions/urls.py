from django.urls import path

from .views import SessionViews

urlpatterns = [
    path('sessions/<int:id>', SessionViews.as_view())
]