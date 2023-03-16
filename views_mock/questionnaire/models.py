from django.db import models

class Questionnaire(models.Model):
    # ID field is automatically generated
    title = models.CharField
    description = models.TextField
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    createdBy = models.CharField
    updatedBy = models.CharField