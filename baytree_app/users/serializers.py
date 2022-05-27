from rest_framework import serializers

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


class MentorRoleSerializer(serializers.ModelSerializer):
    # Need to override id as read_only=False so that it is in 'validated_data'
    id = serializers.IntegerField(read_only=False)

    class Meta:
        model = MentorRole
        fields = ["id", "name", "viewsSessionGroupId", "activity"]

    def create(self, validated_data):
        defaults = {
            "viewsSessionGroupId": validated_data.get("viewsSessionGroupId", None),
            "activity": validated_data.get("activity", None),
        }

        if "name" in validated_data:
            defaults["name"] = validated_data.get("name", None)

        answer, created = MentorRole.objects.update_or_create(
            id=validated_data.get("id", None), defaults=defaults
        )

        return answer


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
