from django.db import models

class StaffSession(models.Model):
    SessionID = models.PositiveIntegerField()
    ContactType = models.CharField(max_length=255, null=True)
    ContactID = models.PositiveIntegerField(null=True)
    Attended = models.PositiveSmallIntegerField(null=True)
    Role = models.CharField(max_length=255)
    ReasonforNotAttending = models.TextField(null=True)
    Name = models.CharField(max_length=255, null=True)


class Session(models.Model):
    SessionID = models.PositiveIntegerField(primary_key=True)
    SessionGroupID = models.PositiveIntegerField(null=True)
    Created = models.DateTimeField(null=True)
    CreatedBy = models.CharField(max_length=255, default="", null=True)
    Updated = models.DateTimeField(null=True)
    UpdatedBy = models.CharField(max_length=255, default="", null=True)
    RestrictedRecord =  models.PositiveIntegerField(null=True)
    SessionType = models.CharField(max_length=255, default="", null=True)
    Name = models.CharField(max_length=255, default="", null=True)
    Activity = models.CharField(max_length=255, default="", null=True)
    LeadStaff = models.PositiveIntegerField()
    ContactType = models.CharField(max_length=255, default="", null=True)
    StartDate = models.DateField(null=True)
    StartTime = models.TimeField(null=True)
    Duration = models.CharField(max_length=255, default="", null=True)
    Cancelled = models.PositiveSmallIntegerField(null=True)
    VenueID = models.PositiveIntegerField(null=True)
    VenueName = models.CharField(max_length=255, default="", null=True)