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
    id = serializers.IntegerField(read_only=False)
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
    user = UserSerializer(read_only=True)
    user_id = serializers.IntegerField(read_only=False)

    menteeUsers = MenteeSerializer(many=True, read_only=True)
    mentorRole = MentorRoleSerializer(read_only=True)
    # Used for updating mentorRole by foreign key id
    mentorRole_id = serializers.PrimaryKeyRelatedField(
        queryset=MentorRole.objects.all(), source="mentorRole", write_only=True
    )

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
            "mentorRole_id",
        )


class AdminSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = AdminUser
        fields = ("user",)
