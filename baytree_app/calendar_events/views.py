from rest_framework import generics, mixins
from baytree_app.FluentLoggingHandler import FluentLoggingHandler
from users.permissions import AdminPermissions

from .models import UkHoliday
from .models import CalendarEvent
from .serializers import CalendarEventSerializer, UkHolidaySerializer

# GET api/calendar_events/uk_holidays/


class CalendarEventUkHolidayListAPIView(generics.ListAPIView):
    queryset = UkHoliday.objects.all()
    serializer_class = UkHolidaySerializer

# GET api/calendar_events/


class CalendarEventListAPIView(generics.ListAPIView):
    queryset = CalendarEvent.objects.all()
    serializer_class = CalendarEventSerializer

# POST api/calendar_events/create/


class CalendarEventCreateAPIView(generics.CreateAPIView):
    queryset = CalendarEvent.objects.all()
    serializer_class = CalendarEventSerializer
    permission_classes = [AdminPermissions]

# PUT, DELETE api/calendar_events/<id>/


class CalendarEventUpdateDestroyAPIVIew(
        mixins.UpdateModelMixin,
        mixins.DestroyModelMixin,
        generics.GenericAPIView):
    queryset = CalendarEvent.objects.all()
    serializer_class = CalendarEventSerializer
    lookup_field = "pk"
    permission_classes = [AdminPermissions]

    def put(self, request, *args, **kwargs):
        response = self.update(request, *args, **kwargs)
        if (response.status_code == 200):
            FluentLoggingHandler.logResponseReceived(
                response, "Successfully edited calendar event")
        else:
            FluentLoggingHandler.logResponseReceived(
                response, "Unable to edit calendar event")
        return response

    def delete(self, request, *args, **kwargs):
        pathInfo = request.path_info.split('/')
        itemId = pathInfo[-2]
        response = self.destroy(request, *args, **kwargs)
        if (response.status_code == 204):
            FluentLoggingHandler.logResponseReceived(
                response, f"Successfully deleted calendar event with ID {itemId}")
        else:
            FluentLoggingHandler.logResponseReceived(
                response, f"Unable to delete calendar event with ID {itemId}")
        return response
