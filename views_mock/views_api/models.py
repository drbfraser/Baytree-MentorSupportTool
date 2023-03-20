from django.db import models


class SessionGroup(models.Model):
    SessionGroupID = models.PositiveIntegerField(primary_key=True)
    Title = models.CharField(max_length=255)
    Description = models.TextField(blank=True)
    LeadStaff = models.PositiveIntegerField()
    OtherStaff = models.PositiveIntegerField(null=True)



class StaffSession(models.Model):
    SessionID = models.OneToOneField("Session", on_delete=models.CASCADE)
    ContactType = models.CharField(max_length=255, null=True)
    ContactID = models.PositiveIntegerField(null=True)
    Attended = models.PositiveSmallIntegerField(null=True)
    Role = models.CharField(max_length=255)
    ReasonforNotAttending = models.TextField(null=True)
    Name = models.CharField(max_length=255, null=True)


class Session(models.Model):
    SessionID = models.PositiveIntegerField(primary_key=True)
    SessionGroupID = models.ForeignKey("SessionGroup", on_delete=models.CASCADE)
    Created = models.DateTimeField(null=True)
    Updated = models.DateTimeField(null=True)
    Name = models.CharField(max_length=255, default="", null=True)
    Activity = models.CharField(max_length=255, default="", null=True)
    LeadStaff = models.PositiveIntegerField()
    Duration = models.CharField(max_length=255, default="", null=True)
    Cancelled = models.PositiveSmallIntegerField(null=True)
    VenueID = models.PositiveIntegerField(null=True)
    VenueName = models.CharField(max_length=255, default="", null=True)
