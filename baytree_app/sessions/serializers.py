# Code adapted from https://www.django-rest-framework.org/tutorial/quickstart/

from .models import Activity
from rest_framework import serializers


class ActivitySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Activity
        fields = ["url", "name"]
