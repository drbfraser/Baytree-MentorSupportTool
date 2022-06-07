from users.models import CustomUser
from rest_framework import serializers
from .models import Goal

class GoalSerializer(serializers.ModelSerializer):
    mentee = serializers.SerializerMethodField(read_only=True)
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
            'content', 
            'status',
        ]
    
    def get_mentee(self, obj):
        return obj.get_mentee()