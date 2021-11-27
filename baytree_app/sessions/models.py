from django.db import models

# Create your models here.
from users.models import CustomUser


class MentorSession(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    mentor = models.ForeignKey(CustomUser, related_name="mentor", on_delete=models.PROTECT, null=True)
    mentee = models.ForeignKey(CustomUser, related_name="mentee", on_delete=models.PROTECT, null=True)
    attended_by_mentor = models.BooleanField(blank=False, default=True)
    attended_by_mentee = models.BooleanField(blank=False, default=True)
    clock_in = models.DateTimeField(blank=True, null=True)
    clock_out = models.DateTimeField(blank=True, null=True)
    notes = models.CharField(blank=True, max_length=1000)

    def __str__(self):
        result = str(self.id) + ", " + self.mentor.email + ", " + self.mentee.email
        return result

