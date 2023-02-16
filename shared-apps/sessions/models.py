from django.db import models


class Venue(models.Model):
    """Contains all allowable venues on Views for session submission"""

    viewsVenueId = models.IntegerField(primary_key=True)
