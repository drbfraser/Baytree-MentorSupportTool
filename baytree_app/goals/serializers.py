from rest_framework import serializers
from .models import Goal, GoalOption
from users.serializers import MentorSerializer

class GoalOptionSerializers(serializers.ModelSerializer):
    class Meta:
        model = GoalOption
        field = ['id', 'name']

class GoalSerializer(serializers.ModelSerializer):
    mentor = MentorSerializer(read_only=True)
    options = GoalOptionSerializers(many=True, read_only=True)
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
            'options'
        ]