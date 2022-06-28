from rest_framework import serializers


class BatchRestSerializer(serializers.ModelSerializer):
    """Serializer to be used to with the BatchRestViewSet.
    Inherits from ModelSerializer, and should be used in a similar
    fashion.

    NOTE: The model primary key MUST be included in the
    derived class Meta fields list and should be declared as read_only=False:
    ex. <pk> = serializers.IntegerField(read_only=False).

    Then, the primary key name should be set on the derived serializer as a string:
    primary_key = "<pk field name>".
    """

    def create(self, validated_data):
        defaults = {}

        for field in self.Meta.fields:
            if field in validated_data and field != self.primary_key:
                defaults[field] = validated_data.get(field, None)

        answer, created = self.Meta.model.objects.update_or_create(
            pk=validated_data.get(self.primary_key, None), defaults=defaults
        )

        return answer
