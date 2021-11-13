from rest_framework import serializers
from .models import Goal

class GoalsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Goal
        fields = ['user', 'date', 'goal_review_date', 'content', 'status']
