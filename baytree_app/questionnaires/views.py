from datetime import datetime, timezone
from django.http import HttpResponse

import requests
from baytree_app.constants import (
    VIEWS_BASE_URL, VIEWS_PASSWORD, VIEWS_USERNAME)
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from users.models import MentorUser

extractedQuestionFields = ["QuestionID", "Question", "inputType", "validation", "category", "enabled"]

# Get the mentor info from the requesting user
# Only returns info for mentor with assigned role and assigned questionnaire
# Otherwise returns nothing
def getMentorWithRoleAndQuestionnaireByUserId(id):
    mentors = MentorUser.objects.filter(
        user_id=id, 
        mentorRole__isnull=False,
        mentorRole__viewsQuestionnaireId__isnull=False
    )
    if not mentors: return None
    return mentors.first()

# GET /api/questionnaires/questionnaire/
@api_view(("GET",))
def get_questionnaire(request):
    """
    Fetch the questionnaire assigned by the the mentor
    """
    # Find the questionnaire id from the requesting user
    mentor = getMentorWithRoleAndQuestionnaireByUserId(request.user.id)
    if mentor is None:
        return Response(status=status.HTTP_404_NOT_FOUND)
    qid = mentor.mentorRole.viewsQuestionnaireId

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
def submit_answer_set(request):
    """
    Submit the answer to the remote Views database
    """
    # Validate data existence
    data = request.data
    if data["questionnaireId"] is None or data["answer"] is None:
        return Response(status=status.HTTP_400_BAD_REQUEST)

    # Find the questionnaire id from the requesting user
    mentor = getMentorWithRoleAndQuestionnaireByUserId(request.user.id)
    if mentor is None:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    # Redundancy check, user won't submit answer set to the wrong question
    qid = mentor.mentorRole.viewsQuestionnaireId
    if data["questionnaireId"] != qid:
        return Response(status=status.HTTP_406_NOT_ACCEPTABLE)
    
    # Construct XML payload
    answerXMLFormat = (
        '<answer id="{0}">'
            "<QuestionID>{0}</QuestionID>"
            "<Answer>{1}</Answer>"
        "</answer>"
    )
    answersXML = [answerXMLFormat.format(id, data["answer"][id]) for id in data["answer"]]

    answerSetXML = (
        "<answer>"
            "<EntityType>Volunteer</EntityType>"
            f"<EntityID>{mentor.viewsPersonId}</EntityID>"
            f"<Date>{datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%S')}</Date>"
            f"{''.join(answersXML)}"
        "</answer>"
    )

    # Send the answer set to View database
    url = f"{VIEWS_BASE_URL}evidence/questionnaires/{qid}/answers"

    response = requests.post(url, answerSetXML, auth=(VIEWS_USERNAME, VIEWS_PASSWORD), headers = {"content-type": "text/xml"})

    # Construct Views API request
    return HttpResponse(response)
