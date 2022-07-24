from rest_framework import serializers
from .models import Preference

class PreferenceSerializer(serializers.ModelSerializer):
  value = serializers.SerializerMethodField()

  class Meta:
    model = Preference
    fields = ["key", "value"]

  def get_value(self, obj):
    return obj.get_value()