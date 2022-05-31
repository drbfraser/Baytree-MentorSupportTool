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
    primary_key = "id"

    class Meta:
        model = MentorRole
        fields = [
            "id",
            "name",
            "viewsQuestionnaireId",
            "viewsSessionGroupId",
            "activity",
        ]


class MentorSerializer(BatchRestSerializer):
    user = UserSerializer()
    menteeUsers = MenteeSerializer(many=True, read_only=True)
    mentorRole = MentorRoleSerializer()
    primary_key = "user_id"

    class Meta:
        model = MentorUser
        fields = (
            "user_id",
            "user",
            "status",
            "menteeUsers",
            "viewsPersonId",
            "mentorRole",
        )


class AdminSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = AdminUser
        fields = ("user",)
