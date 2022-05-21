# Code adapted from https://www.django-rest-framework.org/tutorial/quickstart/

from .models import Activity
from rest_framework import serializers


class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ["id", "name"]
