from rest_framework import serializers
from users.serializers import MentorSerializer

from .models import Goal, GoalCategory


class GoalCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = GoalCategory
        fields = "__all__"


class GoalSerializer(serializers.ModelSerializer):
    mentor = MentorSerializer(read_only=True)
    categories = GoalCategorySerializer(many=True, read_only=True)
    class Meta:
        model = Goal
        fields = [
            'id', 
            'mentor',
            'title', 
            'creation_date', 
            'goal_review_date', 
            'last_update_date', 
            'description', 
            'status',
            'categories'
        ]
