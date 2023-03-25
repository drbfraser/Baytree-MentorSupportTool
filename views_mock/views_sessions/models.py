from django.db import models
from django.utils import timezone

class SessionGroup(models.Model):
    SessionGroupID = models.PositiveIntegerField(primary_key=True)
    Title = models.CharField(max_length=255)
    Description = models.TextField(blank=True)
    LeadStaff = models.PositiveIntegerField(null=True)
    OtherStaff = models.PositiveIntegerField(null=True)


class StaffSession(models.Model):
    SessionID = models.OneToOneField("Session", on_delete=models.CASCADE, db_column="SessionID")
    ContactID = models.ForeignKey("contacts.Person", on_delete=models.CASCADE)
    Attended = models.PositiveSmallIntegerField(null=True)
    Role = models.CharField(max_length=255)
    ReasonforNotAttending = models.TextField(blank=True)
    Name = models.CharField(max_length=255)


class Session(models.Model):
    SessionID = models.PositiveIntegerField(primary_key=True)
    SessionGroupID = models.ForeignKey("SessionGroup", on_delete=models.CASCADE, db_column="SessionGroupID")
    Created = models.DateTimeField(default=timezone.now)
    Updated = models.DateTimeField(null=True)
    Name = models.CharField(max_length=255)
    Activity = models.CharField(max_length=255, null=True)
    LeadStaff = models.PositiveIntegerField()
    Duration = models.CharField(max_length=255)
    Cancelled = models.PositiveSmallIntegerField()
    VenueID = models.PositiveIntegerField()
    VenueName = models.CharField(max_length=255)
    StartDate = models.DateField(default=timezone.now)
    StartTime = models.TimeField(default=timezone.now)
