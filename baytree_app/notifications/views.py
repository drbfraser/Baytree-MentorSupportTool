from django.shortcuts import render

from .serializers import NotificationSerializer

from rest_framework import status
from rest_framework.response import Response
from rest_framework import filters
from rest_framework import generics
from .models import *
from .permissions import *
from .tasks import *
#adapted from https://stackabuse.com/creating-a-rest-api-with-django-rest-framework/

class NotificationViews(generics.ListAPIView):

    permission_classes = [IsOwner]

    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['mentor_id', 'creation_date']

    def get(self, request, mentor_id=None):
        if mentor_id:
            try:
                queryset = Notification.objects.prefetch_related('notification_type').filter(mentor=mentor_id)
            except Notification.DoesNotExist:
                return Response([], status=200)
            read_serializer = NotificationSerializer(queryset, many=True)
        else:
            queryset = Notification.objects.all()
            read_serializer = NotificationSerializer(queryset, many=True)
        return Response(read_serializer.data)

    def post(self, request):
        serializer = NotificationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
     
    def delete(self, request, id=None):
        item = Notification.objects.get(id=id)
        item.delete()
        return Response({"status": "success", "data": "Item Deleted"})
    
    def patch(self, request, mentor_id=None):
        print(mentor_id)
        item = Notification.objects.get(id=mentor_id)
        serializer = NotificationSerializer(item, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"is_read":True})
        else:
            return Response({"status": "error", "data": serializer.errors})
