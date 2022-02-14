from django.http.response import HttpResponse
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
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

        # Since this part is not used, we re skipping right now
        create_serializer = QuestionAndAnswerSerializer(data=request.data)
        if create_serializer.is_valid():
            qa_object = create_serializer.save()
            read_serializer = QuestionAndAnswerSerializer(qa_object)
            return Response(read_serializer.data, status=201)
        return Response(create_serializer.errors, status=400)

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
        questionnaireId = questionnaireId if questionnaireId is not None else 10

        url = 'https://app.viewsapp.net/api/restful/evidence/questionnaires/{0}/answers'.format(questionnaireId)
        data = '''
<answerset>
    <EntityType>Volunteer</EntityType>
    <EntityID>{0}</EntityID>
    <Date>2022-02-13T10:00:00</Date>
    <answers>
        <answer id="23">
            <Answer>{1}</Answer>
        </answer>
        <answer id="24">
            <Answer>{2}</Answer>
        </answer>
        <answer id="25">
            <Answer>{3}</Answer>
        </answer>
        <answer id="26">
            <Answer>{4}</Answer>
        </answer>
        <answer id="27">
            <Answer>{5}</Answer>
        </answer>
    </answers>
</answerset>'''.format(request.data['mentorId'], request.data.get('23', ''), request.data.get('24', ''),
    request.data.get('25', ''), request.data.get('26', ''), request.data.get('27', ''))
    
        print(data)
        
        try:
            response = requests.post(url, data, headers = {"content-type": "text/xml"}, auth=('group.jupiter', 'Wethebest01!'))
            return Response(response,status=200)
        except Exception as e:
            print(e)
            return Response({'errors': "Bad request"}, status=400)