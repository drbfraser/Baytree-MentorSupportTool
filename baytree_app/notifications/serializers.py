from rest_framework import serializers
from .models import *

class NotificationTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationType
        fields = ['id', 'title', 'content', 'type', 'period_in_days']

class NotificationSerializer(serializers.ModelSerializer):
    notification_type = NotificationTypeSerializer()
    class Meta:
        model = Notification
        fields = ['id', 'notification_type', 'mentor', 'creation_date', 'is_read', 'content']
