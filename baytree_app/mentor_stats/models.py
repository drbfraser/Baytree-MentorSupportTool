from django.db import models
from django.db.models import Count


from users.models import CustomUser
from sessions.models import MentorSession


class MentorStats(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    mentor = models.ForeignKey(CustomUser, related_name="mentor_stats", on_delete=models.PROTECT, null=True)
    sessions_total = models.IntegerField(default=0)
    sessions_attended = models.IntegerField(default=0)
    sessions_missed = models.IntegerField(default=0)


    def save(self):
        self.sessions_total = MentorSession.objects.get(mentor=self.mentor).count()
        self.sessions_attended.filter(sessions_attended=True).count()
        self.sessions_missed.filter(sessions_attended=False).count()

    # sessions_remaining = models.IntegerField(52 - sessions_total)

    # sessions remaining = 52 weeks in a year - the weekly sessions completed so far
