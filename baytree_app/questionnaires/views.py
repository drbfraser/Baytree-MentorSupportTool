from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Questionnaire
from .serializers import QuestionnaireSerializer
from .permissions import *
import requests
from django.http import HttpResponse
from .constants import VIEWS_BASE_URL, VIEWS_USERNAME, VIEWS_PASSWORD

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
            r = requests.get(url, auth=(VIEWS_USERNAME, VIEWS_PASSWORD))
            return HttpResponse(r)

        elif request.method == 'POST':
            #TODO: POST to Views
            return HttpResponse('successful POST')

        else:
            return Response({"error": "Method not allowed"}, status=status.HTTP_400_BAD_REQUEST)

extractedQuestionFields = ["QuestionID", "Question", "inputType", "validation", "category"]

# GET /api/questionnaires/questionnaire/
@api_view(("GET",))
def get_questionnaire(request, id=10):
    # Fetch questionnaire id from the requesting user
    

    # Fetch questionnaire by id
    url = f"{VIEWS_BASE_URL}evidence/questionnaires/{id}.json"
    response = requests.get(url, auth=(VIEWS_USERNAME, VIEWS_PASSWORD))
    if response.status_code != 200:
        return Response(status=status.HTTP_404_NOT_FOUND)

    response = response.json()
    
    # Construct the data
    data = {}
    data["questionnaireId"] = id
    data["questions"] = []
    
    # Extract the question data
    questions = response["questions"].values()
    valuesLists = {} # Cache to avoid refetching
    for question in questions:
        q = {key: question[key] for key in extractedQuestionFields}
        
        # Fetch the value list based on the question
        if question["inputType"] == "select":
            valueListId = question["valueListID"]
            if valueListId not in valuesLists:
                valueList = fetch_value_list(valueListId)
                if valueList is None:
                    return Response(status=status.HTTP_404_NOT_FOUND)
                valuesLists[valueListId] = valueList
            q["valueList"] = valuesLists[valueListId]
        
        data["questions"].append(q)

    return Response(data, status=status.HTTP_200_OK)

def fetch_value_list(id):
    url = f"{VIEWS_BASE_URL}admin/valuelists/{id}.json"
    reponse = requests.get(url, auth=(VIEWS_USERNAME, VIEWS_PASSWORD))
    if reponse.status_code != 200:
        return None
    reponse = reponse.json()
    return reponse["items"].values()

# POST /api/questionnaires/questionnaire/submit/
@api_view(("POST", ))
def submit_answer_set(request):
    """
    Submit an answer set to the questionnaire
    """
    pass