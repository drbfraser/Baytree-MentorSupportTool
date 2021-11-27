from django.db import models

# Create your models here.
from users.models import CustomUser


class QA(models.Model):
    def __init__(self, question, answer):
        self.question = question
        self.answer = answer


class MonthlyReport(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    mentor = models.ForeignKey(CustomUser, related_name="monthly_report_mentor", on_delete=models.PROTECT, null=True)
    mentee = models.ForeignKey(CustomUser, related_name="monthly_report_mentee", on_delete=models.PROTECT, null=True)

    def __str__(self):
        result = str(self.id) + ", " + self.mentor.email + ", " + self.mentee.email
        return result
