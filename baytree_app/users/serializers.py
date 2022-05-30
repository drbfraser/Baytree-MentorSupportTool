from rest_framework import serializers

from baytree_app.serializers import BatchRestSerializer

from .models import AdminUser, CustomUser, MenteeUser, MentorUser, MentorRole


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ("id", "email", "first_name", "last_name")


class MenteeSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = MenteeUser
        fields = ("user", "mentorUsers")


class MentorRoleSerializer(BatchRestSerializer):
    class Meta:
        model = MentorRole
        fields = ["id", "name", "viewsSessionGroupId", "activity"]


class MentorSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    menteeUsers = MenteeSerializer(many=True, read_only=True)

    class Meta:
        model = MentorUser
        fields = ("user", "status", "menteeUsers", "viewsPersonId")


class AdminSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = AdminUser
        fields = ("user",)
