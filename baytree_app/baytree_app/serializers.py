from rest_framework import serializers


class BatchRestSerializer(serializers.ModelSerializer):
    """Serializer to be used to with the BatchRestViewSet.
    Inherits from ModelSerializer, and should be used in a similar
    fashion. NOTE: The primary key MUST be included in the Meta fields list
    and should be an IntegerField. A different primary_key can be set by
    setting primary_key = <pk field name> on your derived serializer. The
    default primary_key value is "id".
    """

    def create(self, validated_data):
        if not hasattr(self, "primary_key"):
            self.primary_key = "id"

        if not hasattr(self, self.primary_key):
            setattr(self, self.primary_key, serializers.IntegerField(read_only=False))

        defaults = {}

        for field in self.Meta.fields:
            if field in validated_data and field != self.primary_key:
                defaults[field] = validated_data.get(field, None)

        answer, created = self.Meta.model.objects.update_or_create(
            pk=validated_data.get(self.primary_key, None), defaults=defaults
        )

        return answer
