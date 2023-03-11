from django.db import models

# Create your models here.
class Session(models.Model):
    SessionID = models.PositiveIntegerField(primary_key=True)
    SessionGroupID = models.PositiveIntegerField()
    Created = models.DateTimeField()
    CreatedBy = models.CharField(max_length=255, default="")
    Updated = models.DateTimeField()
    UpdatedBy = models.CharField(max_length=255, default="")
    RestrictedRecord =  models.PositiveIntegerField()
    SessionType = models.CharField(max_length=255, default="")
    Name = models.CharField(max_length=255, default="")
    Activity = models.CharField(max_length=255, default="")
    LeadStaff = models.PositiveIntegerField()
    ContactType = models.CharField(max_length=255, default="")
    StartDate = models.DateField()
    StartTime = models.TimeField()
    Duration = models.CharField(max_length=255, default="")
    Cancelled = models.PositiveSmallIntegerField()
    VenueID = models.PositiveIntegerField()
    VenueName = models.CharField(max_length=255, default="")

    