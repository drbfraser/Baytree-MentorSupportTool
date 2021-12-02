from django.db import models
from questionnaires.models import Questionnaire


class QuestionAndAnswer(models.Model):
    questionnaire = models.ForeignKey(Questionnaire, related_name='questions_and_answers', on_delete=models.CASCADE, null=True)
    question = models.CharField(max_length=500)
    answer = models.CharField(max_length=500)