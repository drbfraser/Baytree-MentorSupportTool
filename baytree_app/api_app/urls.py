from django.urls import path
from . import views

urlpatterns = [
    path('monthly-report/', views.index),
    path('monthly-report/sample', views.report),
]