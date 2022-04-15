from users.models import CustomUser
from rest_framework import serializers
from .models import Goal

class MentorSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email']

class GoalSerializer(serializers.ModelSerializer):
    mentor = MentorSerializer()
    class Meta:
        model = Goal
        fields = ['id', 'mentor', 'mentee', 'title', 'date', 'goal_review_date', 'last_update_date', 'content', 'status']

class GoalSerializerPost(serializers.ModelSerializer):
    class Meta:
        model = Goal
        fields = ['id', 'mentor', 'mentee', 'title', 'date', 'goal_review_date', 'last_update_date', 'content', 'status']
