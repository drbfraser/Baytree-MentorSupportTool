from django.urls import path
from . import views

urlpatterns = [
    path('', views.index),
    path('get-report/', views.get_report),
]