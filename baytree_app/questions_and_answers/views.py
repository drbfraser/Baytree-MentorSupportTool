import json
from django.http.response import HttpResponse
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from datetime import datetime, timezone
from .models import QuestionAndAnswer
from .serializers import QuestionAndAnswerSerializer
from .permissions import *
from .constants import VIEWS_USERNAME, VIEWS_PASSWORD, VIEWS_BASE_URL

QUESTIONNAIRE_ID = 10

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

        # id is optional. Defaults to 10 because that is the id of the questionnaire that matches the local db.
        questionnaireId = questionnaireId if questionnaireId is not None else QUESTIONNAIRE_ID
        
        # Server side validation for the answers. Retrieve the question list from Views and ensure answers to all 
        # the questions are in the request.
        url = '{0}/evidence/questionnaires/{1}/questions?allquestions=1.json'.format(VIEWS_BASE_URL, questionnaireId)
        r = requests.get(url, auth=(VIEWS_USERNAME, VIEWS_PASSWORD))
        if r.status_code != 200:
            print('Failed to get answers. Status code: {0}'.format(r.status_code))
            return Response({'errors': "Failed to get questionnaire details from Views app."}, status=500)

        questions = json.loads(r.content)
        for question in questions:
            if questions[question]['enabled'] == '1' and 'required' in questions[question]['validation'] and questions[question]['QuestionID'] not in request.data:
                # request does not contain answer to a question that's enabled and required.
                return Response({'errors': "{0} is required.".format(questions[question]['Question'])}, status=400)

        now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S")

        url = 'https://app.viewsapp.net/api/restful/evidence/questionnaires/{0}/answers'.format(questionnaireId)

        answerTemplate = '''
    <answer id="{0}">
        <Answer>{1}</Answer>
    </answer>'''

        answers = ''
        for qid in request.data:
            if qid == 'mentorId':
                # skip mentorId field
                continue
                
            answers += answerTemplate.format(qid, request.data[qid])

        data = '''
<answers>
    <EntityType>Volunteer</EntityType>
    <EntityID>{0}</EntityID>
    <Date>{1}</Date>{2}
</answers>'''.format(request.data['mentorId'], now, answers)

        print(data)
        
        try:
            response = requests.post(url, data, headers = {"content-type": "text/xml"}, auth=(VIEWS_USERNAME, VIEWS_PASSWORD))
           
            return Response(response,status=200)
        except Exception as e:
            print(e)
            return Response({'errors': "Bad request"}, status=400)