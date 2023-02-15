from rest_framework import serializers

from baytree_app.serializers import BatchRestSerializer
from .models import Venue


class VenueSerializer(BatchRestSerializer):
    viewsVenueId = serializers.IntegerField(read_only=False)
    primary_key = "viewsVenueId"

    class Meta:
        model = Venue
        fields = ["viewsVenueId"]
