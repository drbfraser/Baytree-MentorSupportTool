from rest_framework import generics, mixins

from users.permissions import AdminPermissions

from .models import Holiday
from .serializers import HolidaySerializer

# GET api/holidays/
class HolidayListAPIView(generics.ListAPIView):
  queryset = Holiday.objects.all()
  serializer_class = HolidaySerializer

# POST api/holidays/create/
class HolidayCreateAPIView(generics.CreateAPIView):
  queryset = Holiday.objects.all()
  serializer_class = HolidaySerializer
  permission_classes = [AdminPermissions]

# PUT, DELETE api/holidays/<id>/
class HolidayUpdateDestroyAPIVIew(
  mixins.UpdateModelMixin,
  mixins.DestroyModelMixin,
  generics.GenericAPIView):
  queryset = Holiday.objects.all()
  serializer_class = HolidaySerializer
  lookup_field = "pk"
  permission_classes = [AdminPermissions]

  def put(self, request, *args, **kwargs):
    return self.update(request, *args, **kwargs)

  def delete(self, request, *args, **kwargs):
    return self.destroy(request, *args, **kwargs)
