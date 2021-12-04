from rest_framework.views import APIView
from rest_framework.response import Response
from .models import MentorStats
from .serializers import MentorStatsSerializer
from .permissions import *


class MentorStatsViews(APIView):
    permission_classes = [IsOwner]

    def get(self, request, id=None):
        if id:
            try:
                queryset = MentorStats.objects.get(id=id)
            except MentorStats.DoesNotExist:
                return Response({'errors': 'This Q&A does not exist.'}, status=400)
            read_serializer = MentorStatsSerializer(queryset)
        else:
            queryset = MentorStats.objects.all()
            read_serializer = MentorStatsSerializer(queryset, many=True)
        return Response(read_serializer.data)

    def post(self, request):
        create_serializer = MentorStatsSerializer(data=request.data)
        if create_serializer.is_valid():
            qa_object = create_serializer.save()
            read_serializer = MentorStatsSerializer(qa_object)
            return Response(read_serializer.data, status=201)
        return Response(create_serializer.errors, status=400)

    def put(self, request, id=None):
        try:
            qa = MentorStats.objects.get(id=id)
        except MentorStats.DoesNotExist:
            return Response({'errors': 'This Q&A does not exist.'}, status=400)
        update_serializer = MentorStatsSerializer(qa, data=request.data)

        if update_serializer.is_valid():
            qa_object = update_serializer.save()
            read_serializer = MentorStatsSerializer(qa_object)
            return Response(read_serializer.data, status=200)
        return Response(update_serializer.errors, status=400)

    def delete(self, request, id=None):
        try:
            qa = MentorStats.objects.get(id=id)
        except MentorStats.DoesNotExist:
            return Response({'errors': 'This Q&A does not exist.'}, status=400)

        qa.delete()

        return Response(status=204)
