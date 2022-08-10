from django.urls import path

from .views import PreferenceListView, PreferenceRetrieveUpdateDestroyAPIView

urlpatterns = [
    path("", PreferenceListView.as_view()),
    path("<str:key>/", PreferenceRetrieveUpdateDestroyAPIView.as_view()),
]
