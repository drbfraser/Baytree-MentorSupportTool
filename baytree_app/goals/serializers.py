from rest_framework import serializers
from .models import Goal

class GoalsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Goal
        fields = ['title', 'details', 'id']
