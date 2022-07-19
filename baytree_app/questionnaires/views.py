from datetime import datetime, timezone
from django.http import HttpResponse

import requests
from baytree_app.constants import (
    VIEWS_BASE_URL, VIEWS_PASSWORD, VIEWS_USERNAME)
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from views_api.associations import get_mentee_ids_from_mentor
import xml.etree.ElementTree as ET

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
    if data["questionnaireId"] is None \
        or data["answerSet"] is None \
        or data["person"] is None:
        return Response(status=status.HTTP_400_BAD_REQUEST)

    # Find the questionnaire id from the requesting user
    mentor = getMentorWithRoleAndQuestionnaireByUserId(request.user.id)
    if mentor is None:
        return Response(status=status.HTTP_404_NOT_FOUND)

    # Redundancy check, user won't submit answer set to the wrong question
    qid = mentor.mentorRole.viewsQuestionnaireId
    if data["questionnaireId"] != qid:
        return Response(status=status.HTTP_406_NOT_ACCEPTABLE)

    # Construct answer XML format payload
    answerXMLFormat = (
        '<answer id="{0}">'
            "<QuestionID>{0}</QuestionID>"
            "<Answer>{1}</Answer>"
        "</answer>"
    )
    answersXML = [answerXMLFormat.format(id, data["answerSet"][id]) for id in data["answerSet"]]

    url = ""

    # Get the person
    person = data["person"]

    # Construct URL and answer set XML payload depending on whether person is a Mentor or Mentee
    if person == "mentee":
        # Find the Mentee's ID
        # menteeUser = MentorUser.objects.filter(pk=request.user.id)
        mentor_user = MentorUser.objects.filter(pk=request.user.id)
        if not mentor_user.exists():
            return Response(
                "The current requesting user is not a mentor!",
                status=status.HTTP_401_UNAUTHORIZED,
            )
        
        mentor_user = mentor_user.first()

        menteeIds = get_mentee_ids_from_mentor(mentor_user)

        menteeId = menteeIds[0]
        # Construct Mentee the answer set XML payload
        answerSetXML = (
        "<answer>"
            "<EntityType>Person</EntityType>"
            f"<EntityID>{menteeId}</EntityID>"
            f"<Date>{datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%S')}</Date>"
            f"{''.join(answersXML)}"
        "</answer>"
        )
        # Construct Mentee URL
        url = f"{VIEWS_BASE_URL}contacts/participants/{menteeId}/questionnaires/{qid}"
    else:
        # Construct Mentor the answer set XML payload
        answerSetXML = (
            "<answer>"
                "<EntityType>Volunteer</EntityType>"
                f"<EntityID>{mentor.viewsPersonId}</EntityID>"
                f"<Date>{datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%S')}</Date>"
                f"{''.join(answersXML)}"
            "</answer>"
        )
        # Construct Mentor URL
        url = f"{VIEWS_BASE_URL}evidence/questionnaires/{qid}/answers"

    # Send the answer set to View database
    response = requests.post(url, answerSetXML, auth=(VIEWS_USERNAME, VIEWS_PASSWORD), headers = {"content-type": "text/xml"})
    response.status_code

    # Construct dictionary response data
    responseData = {}
    responseData["questionnaireId"] = qid
    answerSet = data["answerSet"]
    responseData["mentor"] = list(answerSet.values())[0]
    responseData["mentee"] = list(answerSet.values())[1]
    parsedXMLRoot = ET.fromstring(response.text)
    responseData["submissionId"] = parsedXMLRoot.get("id")
    responseData["viewsResponse"] = response.text

    return Response(responseData, response.status_code)
    