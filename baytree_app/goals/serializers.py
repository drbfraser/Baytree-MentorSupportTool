from rest_framework import serializers
from .models import Goal
from users.serializers import MentorSerializer

class GoalSerializer(serializers.ModelSerializer):
    mentor = MentorSerializer(read_only=True)
    mentee = serializers.SerializerMethodField(read_only=True)
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
        ]
    
    def get_mentee(self, obj):
        return obj.get_mentee()