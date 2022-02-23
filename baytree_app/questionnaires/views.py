from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Questionnaire
from .serializers import QuestionnaireSerializer
from .permissions import *
import requests
from django.http import HttpResponse
from .constants import views_username, views_password


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
        # id is optional. Defaults to 10 because that is the id of the questionnaire that matches the local db.
        id = id if id is not None else 10

        url = 'https://app.viewsapp.net/api/restful/evidence/questionnaires/{0}/questions?allquestions=1.json'.format(id)

        if request.method == 'GET':
            r = requests.get(url, auth=(views_username, views_password))
            return HttpResponse(r)

        elif request.method == 'POST':
            #TODO: POST to Views
            return HttpResponse('successful POST')

        else:
            return Response({"error": "Method not allowed"}, status=status.HTTP_400_BAD_REQUEST)
