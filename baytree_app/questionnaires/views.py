from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Questionnaire
from .serializers import QuestionnaireSerializer
from .permissions import *
import requests
from django.http import HttpResponse


class QuestionnaireView(APIView):
    permission_classes = [IsOwner]

    def get(self, request, id=None):
        if id:
            try:
                queryset = Questionnaire.objects.get(id=id)
            except Questionnaire.DoesNotExist:
                return Response({'errors': 'This questionnaire does not exist.'}, status=400)
            read_serializer = QuestionnaireSerializer(queryset)
        else:
            queryset = Questionnaire.objects.all()
            read_serializer = QuestionnaireSerializer(queryset, many=True)
        return Response(read_serializer.data)

    def post(self, request):
        create_serializer = QuestionnaireSerializer(data=request.data)
        if create_serializer.is_valid():
            questionnaire_object = create_serializer.save()
            read_serializer = QuestionnaireSerializer(questionnaire_object)
            return Response(read_serializer.data, status=201)
        return Response(create_serializer.errors, status=400)

    def put(self, request, id=None):
        try:
            questionnaire = Questionnaire.objects.get(id=id)
        except Questionnaire.DoesNotExist:
            return Response({'errors': 'This questionnaire does not exist.'}, status=400)
        update_serializer = QuestionnaireSerializer(questionnaire, data=request.data)

        if update_serializer.is_valid():
            questionnaire_object = update_serializer.save()
            read_serializer = QuestionnaireSerializer(questionnaire_object)
            return Response(read_serializer.data, status=200)
        return Response(update_serializer.errors, status=400)

    def delete(self, request, id=None):
        try:
            questionnaire = Questionnaire.objects.get(id=id)
        except Questionnaire.DoesNotExist:
            return Response({'errors': 'This questionnaire does not exist.'}, status=400)
        questionnaire.delete()
        return Response(status=204)

    def index(request):
        return HttpResponse('index')

    def get_questionnaire(request, id=None):

        url = 'https://app.viewsapp.net/api/restful/evidence/questionnaires/10/questions?allquestions=1.json'
        url_head = 'https://app.viewsapp.net/api/restful/evidence/questionnaires/'
        url_tail = '/questions?allquestions=1.json'

        if request.method == 'GET':
            if id:
                url = url_head + id + url_tail
            r = requests.get(
                url,
                auth=('group.jupiter', 'Wethebest01!'))
            #print(r.content)
            return HttpResponse(r)

        elif request.method == 'POST':
            #TODO: POST to Views
            return HttpResponse('successful POST')

        else:
            return Response({"error": "Method not allowed"}, status=status.HTTP_400_BAD_REQUEST)