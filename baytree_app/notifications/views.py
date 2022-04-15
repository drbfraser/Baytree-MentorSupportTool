from django.shortcuts import render
from users.permissions import userIsAdmin, userIsSuperUser, AdminPermissions
from .serializers import NotificationSerializer

from rest_framework import status
from rest_framework.response import Response
from rest_framework import filters
from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import *
from .permissions import *
from .tasks.tasks import *
#adapted from https://stackabuse.com/creating-a-rest-api-with-django-rest-framework/

class NotificationViews(generics.ListAPIView):

    permission_classes = [IsAuthenticated & (IsRequestingMentor | AdminPermissions)]
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['mentor_id', 'creation_date']

    def get(self, request):
        mentor_id = request.GET.get('mentor_id', None)

        if mentor_id is not None:
            try:
                queryset = Notification.objects.prefetch_related('notification_type').filter(mentor=mentor_id).order_by('-creation_date')
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

    def delete(self, request, notification_id=None):
        item = Notification.objects.get(id=notification_id)

        # Only if the current requesting user is the mentor that owns the notification
        # or the requesting user is an admin user or super user, they are authorized to delete
        # we check inside this function vs. IsOwner since has_object_permissions doesn't apply to generics.ListAPIView
        if item.mentor_id == request.user.id \
            or userIsAdmin(request.user) or userIsSuperUser(request.user):
            item.delete()
            return Response({"status": "success", "data": "Item Deleted"})
        else:
            return Response({"status": "Error. Unauthorized deletion."}, status=status.HTTP_401_UNAUTHORIZED)
    
    def patch(self, request, notification_id=None):
        item = Notification.objects.get(id=notification_id)
        serializer = NotificationSerializer(item, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"is_read":True})
        else:
            return Response({"status": "error", "data": serializer.errors})

@api_view(['GET'])
@permission_classes([IsAuthenticated & (IsRequestingMentor | AdminPermissions)])
def get_unread_notification_count(request):
    mentor_id = request.GET.get('mentor_id', None)
    try:
        unread_notifications = Notification.objects.prefetch_related('notification_type').filter(mentor=mentor_id, is_read=0).count()
    except Notification.DoesNotExist:
        unread_notifications = 0

    return Response({unread_notifications}, status=200)
