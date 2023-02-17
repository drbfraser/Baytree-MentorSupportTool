from django.db import models
class MyModel(models.Model):
  date = models.DateField

MyModel.objects.using('views-mock-db')