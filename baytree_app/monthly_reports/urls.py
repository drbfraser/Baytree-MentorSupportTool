from django.urls import path
from .views import MonthlyReportView

urlpatterns = [
    path('', MonthlyReportView.as_view()),
    path('<int:id>', MonthlyReportView.as_view()),
]