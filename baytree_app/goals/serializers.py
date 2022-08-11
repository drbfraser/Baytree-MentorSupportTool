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
            'mentee_id',
            'title', 
            'creation_date', 
            'goal_review_date', 
            'last_update_date', 
            'description', 
            'status',
            'categories'
        ]

class GoalDetailSerializer(serializers.ModelSerializer):
    mentor = MentorSerializer(read_only=True)
    mentee = serializers.SerializerMethodField(read_only=True)
    categories = GoalCategorySerializer(many=True, read_only=True)
    class Meta:
        model = Goal
        fields = [
            'id', 
            'mentor',
            'mentee_id',
            'mentee',
            'title', 
            'creation_date', 
            'goal_review_date', 
            'last_update_date', 
            'description', 
            'status',
            'categories'
        ]

    def get_mentee(self, obj):
        return obj.get_mentee()
