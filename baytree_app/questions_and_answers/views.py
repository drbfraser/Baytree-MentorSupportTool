from django.http.response import HttpResponse
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from datetime import datetime, timezone
from .models import QuestionAndAnswer
from .serializers import QuestionAndAnswerSerializer
from .permissions import *

class QuestionAndAnswerView(generics.ListAPIView):
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
        return self.submit_new_answer_set(request)

    def put(self, request, id=None):
        try:
            qa = QuestionAndAnswer.objects.get(id=id)
        except QuestionAndAnswer.DoesNotExist:
            return Response({'errors': 'This Q&A does not exist.'}, status=400)
        update_serializer = QuestionAndAnswerSerializer(qa, data=request.data)

        if update_serializer.is_valid():
            qa_object = update_serializer.save()
            read_serializer = QuestionAndAnswerSerializer(qa_object)
            return Response(read_serializer.data, status=200)
        return Response(update_serializer.errors, status=400)

    def delete(self, request, id=None):
        try:
            qa = QuestionAndAnswer.objects.get(id=id)
        except QuestionAndAnswer.DoesNotExist:
            return Response({'errors': 'This Q&A does not exist.'}, status=400)

        qa.delete()

        return Response(status=204)

    def submit_new_answer_set(self, request, questionnaireId=None):

        if '23' not in request.data:
            return Response({'errors': "Mentor's name is required."}, status=400)
        if '24' not in request.data:
            return Response({'errors': "Mentee's name is required."}, status=400)
        if '25' not in request.data:
            return Response({'errors': "Reporting Period is required."}, status=400)
        if '26' not in request.data:
            return Response({'errors': "Mentee's engaging with session information is required."}, status=400)
        if '27' not in request.data:
            return Response({'errors': "Mentee's arrival time information is required."}, status=400)
        

        # id is optional. Defaults to 10 because that is the id of the questionnaire that matches the local db.
        questionnaireId = questionnaireId if questionnaireId is not None else 10
        now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S")

        url = 'https://app.viewsapp.net/api/restful/evidence/questionnaires/{0}/answers'.format(questionnaireId)
        data = '''
<answers>
    <EntityType>Volunteer</EntityType>
    <EntityID>{0}</EntityID>
    <Date>{1}</Date>
    <answer id="23">
        <Answer>{2}</Answer>
    </answer>
    <answer id="24">
        <Answer>{3}</Answer>
    </answer>
    <answer id="25">
        <Answer>{4}</Answer>
    </answer>
    <answer id="26">
        <Answer>{5}</Answer>
    </answer>
    <answer id="27">
        <Answer>{6}</Answer>
    </answer>
</answers>'''.format(request.data['mentorId'], now, request.data.get('23', ''), request.data.get('24', ''),
    request.data.get('25', ''), request.data.get('26', ''), request.data.get('27', ''))

        print(data)
        
        try:
            response = requests.post(url, data, headers = {"content-type": "text/xml"}, auth=('',''))
           
            return Response(response,status=200)
        except Exception as e:
            print(e)
            return Response({'errors': "Bad request"}, status=400)