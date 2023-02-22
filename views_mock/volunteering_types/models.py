from django.db import models
class VolunteeringType(models.Model):
  type = models.CharField(max_length=30, default='')
