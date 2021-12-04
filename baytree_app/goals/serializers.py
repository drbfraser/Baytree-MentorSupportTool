from rest_framework import serializers
from .models import Goal

class GoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Goal
        fields = ['id', 'mentor', 'mentee', 'title', 'date', 'goal_review_date', 'content', 'status']
