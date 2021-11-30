from django.db import models
from monthly_reports.models import MonthlyReport


class QuestionAndAnswer(models.Model):
    monthly_report = models.ForeignKey(MonthlyReport, related_name='questions_and_answers', on_delete=models.CASCADE, null=True)
    question = models.CharField(max_length=500)
    answer = models.CharField(max_length=500)