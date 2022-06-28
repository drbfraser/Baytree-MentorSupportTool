from rest_framework.permissions import IsAuthenticated
from sessions.serializers import VenueSerializer
from sessions.models import Venue
from baytree_app.views import BatchRestViewSet
from users.permissions import AdminPermissions


class VenueViewSet(BatchRestViewSet):
    queryset = Venue.objects.all()
    serializer_class = VenueSerializer
    model_class = Venue

    def get_permissions(self):
        if (
            self.action == "create"
            or self.action == "update"
            or self.action == "partial_update"
            or self.action == "destroy"
        ):
            permission_classes = [IsAuthenticated & AdminPermissions]
        elif self.action == "list" or self.action == "retrieve":
            permission_classes = [IsAuthenticated]

        return [permission() for permission in permission_classes]
