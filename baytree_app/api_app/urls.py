from django.urls import path
from .views import MonthlyReportViews

urlpatterns = [
    path('monthly-report/', MonthlyReportViews.as_view())
]