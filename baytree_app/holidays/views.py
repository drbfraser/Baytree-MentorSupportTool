from rest_framework import generics

from users.permissions import AdminPermissions

from .models import Holiday
from .serializers import HolidaySerializer

# GET api/holidays/
class HolidayListAPIView(generics.ListAPIView):
  queryset = Holiday.objects.all()
  serializer_class = HolidaySerializer

holiday_list_view = HolidayListAPIView.as_view()

# POST api/holidays/create
class HolidayCreateAPIView(generics.CreateAPIView):
  queryset = Holiday.objects.all()
  serializer_class = HolidaySerializer
  permission_classes = [AdminPermissions]

holiday_create_view = HolidayCreateAPIView.as_view()

# PUT api/holidays/<id>/update/
class HolidayUpdateAPIView(generics.UpdateAPIView):
  queryset = Holiday.objects.all()
  serializer_class = HolidaySerializer
  lookup_field = 'pk'
  permission_classes = [AdminPermissions]

holiday_update_view = HolidayUpdateAPIView.as_view()

# DELETE api/hokidays/<id>/delete/
class HolidayDestroyAPIView(generics.DestroyAPIView):
  queryset = Holiday.objects.all()
  serializer_class = HolidaySerializer
  lookup_field = 'pk'
  permission_classes = [AdminPermissions]

holiday_destroy_view = HolidayDestroyAPIView.as_view()