import json

from django.db import models
from django.db.models.query import QuerySet

# Create your models here.
class CaseInsensitiveQuerySet(QuerySet):
    def _filter_or_exclude(self, mapper, *args, **kwargs):
        if 'key' in kwargs:
            kwargs['key__iexact'] = kwargs['key']
            del kwargs['key']
        return super(CaseInsensitiveQuerySet, self)._filter_or_exclude(mapper, *args, **kwargs)

class PreferenceManager(models.Manager):
    def get_query_set(self):
        return CaseInsensitiveQuerySet(self.model)

class Preference(models.Model):
  key = models.CharField(max_length=255, unique=True)
  objects = PreferenceManager()

  # Needs to upgrade to MariaDB from 5.5 -> 10.2 or later
  # To use the models.JSONField()
  value = models.CharField(max_length=1000)
