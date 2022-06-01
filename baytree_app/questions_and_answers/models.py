from django.db import models


class QuestionAndAnswer(models.Model):
    question = models.CharField(max_length=500)
    answer = models.CharField(max_length=500)