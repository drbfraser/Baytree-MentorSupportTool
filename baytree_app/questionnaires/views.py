from datetime import datetime, timezone
import json
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import requests
from baytree_app.constants import VIEWS_BASE_URL, VIEWS_USERNAME, VIEWS_PASSWORD

extractedQuestionFields = ["QuestionID", "Question", "inputType", "validation", "category"]

"""
Get the value list by the valueListID from Views database
"""
def fetch_value_list(id):
    url = f"{VIEWS_BASE_URL}admin/valuelists/{id}.json"
    reponse = requests.get(url, auth=(VIEWS_USERNAME, VIEWS_PASSWORD))
    if reponse.status_code != 200:
        return None
    reponse = reponse.json()
    return reponse["items"].values()

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

    url = '{0}/evidence/questionnaires/{1}/answers'.format(VIEWS_BASE_URL, questionnaireId)

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

# GET /api/questionnaires/questionnaire/
@api_view(("GET",))
def get_questionnaire(request, id=10):
    """
    Fetch the questionnaire assigned by the user
    """
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

# POST /api/questionnaires/questionnaire/submit/
@api_view(("POST", ))
def submit_answer_set(request):
    """
    Submit an answer set to the questionnaire
    """
    pass