from django.urls import path
from .views import SessionView

urlpatterns = [
    path('', SessionView.as_view()),
    path('<int:id>', SessionView.as_view())
]