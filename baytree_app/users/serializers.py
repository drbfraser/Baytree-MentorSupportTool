from rest_framework import serializers

from .models import CustomUser, MenteeUser, MentorUser


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'first_name', 'last_name')


class MenteeSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = MenteeUser
        fields = ('user', 'mentorid')


class MentorSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    menteeuser = MenteeSerializer(many=True, read_only=True)

    class Meta:
        model = MentorUser
        fields = ('user', 'status', 'menteeuser')
