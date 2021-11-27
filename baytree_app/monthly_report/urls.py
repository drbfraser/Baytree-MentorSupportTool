from django.urls import path
from .views import MonthlyReportView

urlpatterns = [
    # path('', MonthlyReportView.as_view()),
    path('monthlyreport', MonthlyReportView.as_view())
]