from django.db import models

# Create your models here.
from django.forms import forms
from users.models import CustomUser


class QuestionAndResponse(models.Model):
    question = models.CharField(max_length=500)
    answer = models.CharField(max_length=500)


class MonthlyReport(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    mentor = models.ForeignKey(CustomUser, related_name="monthly_report_mentor", on_delete=models.PROTECT, null=True)
    mentee = models.ForeignKey(CustomUser, related_name="monthly_report_mentee", on_delete=models.PROTECT, null=True)
    question_and_response_list = models.ForeignKey(QuestionAndResponse, related_name="QARs_in_monthly_report", on_delete=models.CASCADE, null=True)

    def __str__(self):
        result = str(self.id) + ", " + self.mentor.email + ", " + self.mentee.email
        return result
