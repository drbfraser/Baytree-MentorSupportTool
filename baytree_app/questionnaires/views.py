from datetime import datetime, timezone

import requests
from baytree_app.constants import (
    VIEWS_BASE_URL, VIEWS_PASSWORD, VIEWS_USERNAME)
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from users.models import MentorUser

extractedQuestionFields = ["QuestionID", "Question", "inputType", "validation", "category", "enabled"]

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

# GET /api/questionnaires/questionnaire/
@api_view(("GET",))
def get_questionnaire(request):
    """
    Fetch the questionnaire assigned by the the mentor
    """
    # Find the questionnaire id from the requesting user
    mentors = MentorUser.objects.filter(user_id=request.user.id)
    if not mentors:
        return Response(status=status.HTTP_404_NOT_FOUND)

    mentorRole = mentors.first().mentorRole

    if not mentorRole:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    qid = mentorRole.viewsQuestionnaireId

    # Fetch questionnaire by id
    url = f"{VIEWS_BASE_URL}evidence/questionnaires/{qid}.json"
    response = requests.get(url, auth=(VIEWS_USERNAME, VIEWS_PASSWORD))
    if response.status_code != 200:
        return Response(status=status.HTTP_404_NOT_FOUND)

    response = response.json()
    
    # Construct the data
    data = {}
    data["questionnaireId"] = qid
    data["questions"] = []
    
    # Extract the question data
    questions = response["questions"].values()
    for question in questions:
        q = {key: question[key] for key in extractedQuestionFields}
        data["questions"].append(q)

    return Response(data, status=status.HTTP_200_OK)

# POST /api/questionnaires/questionnaire/submit/
@api_view(("POST", ))
def submit_answer_set(request, id=33):
    """
    Submit an answer set to the questionnaire
    """
    # Contruct XML data from JSON
    data = request.data
    answerXMLFormat = (
        '<answer id="{0}">'
            "<QuestionID>{0}</QuestionID>"
            "<Answer>{1}</Answer>"
        "</answer>"
    )
    answersXML = [answerXMLFormat.format(id, data[id]) for id in data]

    answerSetXML = (
        "<answer>"
            "<EntityType>Volunteer</EntityType>"
            f"<EntityID>{76}</EntityID>"
            f"<Date>{datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%S')}</Date>"
            f"{''.join(answersXML)}"
        "</answer>"
    )

    print(answerSetXML)
    url = f"{VIEWS_BASE_URL}evidence/questionnaires/{id}/answers"

    # reponse = requests.post(url, answerSetXML, auth=(VIEWS_USERNAME, VIEWS_PASSWORD), headers = {"content-type": "text/xml"})

    # Construct Views API request
    return Response(status=status.HTTP_200_OK)
