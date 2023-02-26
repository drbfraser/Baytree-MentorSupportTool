from django.db import models

# Create your models here.
class Session(models.Model):
    session_group_id = models.PositiveIntegerField()
    created = models.DateTimeField()
    created_by = models.CharField(max_length=255, default="")
    updated = models.DateTimeField()
    updated_by = models.CharField(max_length=255, default="")
    restricted_record =  models.PositiveIntegerField()
    session_type = models.CharField(max_length=255, default="")
    name = models.CharField(max_length=255, default="")
    activity = models.CharField(max_length=255, default="")
    lead_staff = models.PositiveIntegerField()
    contact_type = models.CharField(max_length=255, default="")
    start_date = models.DateField()
    start_time = models.TimeField()
    duration = models.CharField(max_length=255, default="")
    cancelled = models.PositiveSmallIntegerField()
    venue_id = models.PositiveIntegerField()
    venue_name = models.CharField(max_length=255, default="")

    