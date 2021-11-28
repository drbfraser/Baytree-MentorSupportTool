from django.db import models

# Create your models here.
from django.forms import forms
from users.models import CustomUser

from questions_and_answers.models import QuestionAndAnswer


class MonthlyReport(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    mentor = models.ForeignKey(CustomUser, related_name="monthly_report_mentor", on_delete=models.PROTECT, null=True)
    mentee = models.ForeignKey(CustomUser, related_name="monthly_report_mentee", on_delete=models.PROTECT, null=True)
    question_and_response_list = models.ForeignKey(QuestionAndAnswer, related_name="QAs_in_monthly_report", on_delete=models.CASCADE, null=True)

    def __str__(self):
        result = str(self.id) + ", " + self.mentor.email + ", " + self.mentee.email
        return result
