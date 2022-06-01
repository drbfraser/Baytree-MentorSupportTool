from rest_framework import serializers


class BatchRestSerializer(serializers.ModelSerializer):
    """Serializer to be used to with the BatchRestViewSet.
    Assumes that the model's primary key is "id".
    Inherits from ModelSerializer, and should be used in the same
    fashion. "id" MUST be included in the Meta fields list.
    """

    # Need to override id as read_only=False so that it is in 'validated_data'
    id = serializers.IntegerField(read_only=False)

    def create(self, validated_data):
        defaults = {}

        for field in self.Meta.fields:
            if field in validated_data and field != "id":
                defaults[field] = validated_data.get(field, None)

        answer, created = self.Meta.model.objects.update_or_create(
            id=validated_data.get("id", None), defaults=defaults
        )

        return answer
