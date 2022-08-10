from rest_framework import generics

from users.permissions import AdminPermissions
from .models import Preference
from .serializers import PreferenceSerializer


# GET /api/preferences/
class PreferenceListView(generics.ListAPIView):
  queryset = Preference.objects.all()
  serializer_class = PreferenceSerializer
  permission_classes = [AdminPermissions]

# GET /api/preferences/<key>/
class PreferenceRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
  queryset = Preference.objects.all()
  serializer_class = PreferenceSerializer
  permission_classes = [AdminPermissions]
  lookup_field = 'key'