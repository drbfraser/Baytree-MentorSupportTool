from rest_framework.views import APIView
from rest_framework.response import Response
from .models import QuestionAndAnswer
from .serializers import QuestionAndAnswerSerializer
from .permissions import *

class QuestionAndAnswerView(APIView):
    permission_classes = [IsOwner]

    def get(self, request, id=None):
        if id:
            try:
                queryset = QuestionAndAnswer.objects.get(id=id)
            except QuestionAndAnswer.DoesNotExist:
                return Response({'errors': 'This Q&A does not exist.'}, status=400)
            read_serializer = QuestionAndAnswerSerializer(queryset)
        else:
            queryset = QuestionAndAnswer.objects.all()
            read_serializer = QuestionAndAnswerSerializer(queryset, many=True)
        return Response(read_serializer.data)

    def post(self, request):
        create_serializer = QuestionAndAnswerSerializer(data=request.data)
        if create_serializer.is_valid():
            qar_object = create_serializer.save()
            read_serializer = QuestionAndAnswerSerializer(qar_object)
            return Response(read_serializer.data, status=201)
        return Response(create_serializer.errors, status=400)

    def put(self, request, id=None):
        try:
            qar = QuestionAndAnswer.objects.get(id=id)
        except QuestionAndAnswer.DoesNotExist:
            return Response({'errors': 'This Q&A does not exist.'}, status=400)
        update_serializer = QuestionAndAnswerSerializer(qar, data=request.data)

        if update_serializer.is_valid():
            qar_object = update_serializer.save()
            read_serializer = QuestionAndAnswerSerializer(qar_object)
            return Response(read_serializer.data, status=200)
        return Response(update_serializer.errors, status=400)

    def delete(self, request, id=None):
        try:
            qar = QuestionAndAnswer.objects.get(id=id)
        except QuestionAndAnswer.DoesNotExist:
            return Response({'errors': 'This Q&A does not exist.'}, status=400)

        qar.delete()

        return Response(status=204)
