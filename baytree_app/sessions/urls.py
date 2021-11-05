from django.urls import path

from .views import SessionView

urlpatterns = [
    path('sessions/', SessionView.as_view()),
    path('sessions/<int:id>', SessionView.as_view())
]