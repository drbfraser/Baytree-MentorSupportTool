from django.db import models


class MentorSession(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    mentor = models.ForeignKey(
        "users.CustomUser",
        related_name="sessions_mentor",
        on_delete=models.PROTECT,
        null=True,
    )
    mentee = models.ForeignKey(
        "users.CustomUser",
        related_name="sessions_mentee",
        on_delete=models.PROTECT,
        null=True,
    )
    attended_by_mentor = models.BooleanField(blank=False, default=True)
    attended_by_mentee = models.BooleanField(blank=False, default=True)
    clock_in = models.DateTimeField(blank=True, null=True)
    clock_out = models.DateTimeField(blank=True, null=True)
    notes = models.CharField(blank=True, max_length=1000)
    cancelled = models.BooleanField(default=False)

    # Is null when no corresponding session in views (missed or cancelled)
    viewsSessionId = models.CharField(null=True, max_length=50)

    def __str__(self):
        result = str(self.id) + ", " + self.mentor.email + ", " + self.mentee.email
        return result
