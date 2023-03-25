from datetime import datetime, timezone
import requests

from baytree_app.FluentLoggingHandler import FluentLoggingHandler
from baytree_app.constants import (
    VIEWS_BASE_URL)
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from views_api.associations import get_mentee_ids_from_mentor
import xml.etree.ElementTree as ET

import threading
from users.models import MentorUser

extractedQuestionFields = ["QuestionID", "Question",
                           "inputType", "validation", "category", "enabled"]


# Get the mentor info from the requesting user
# Only returns info for mentor with assigned role and assigned questionnaire
# Otherwise returns nothing
def getMentorWithRoleAndQuestionnaireByUserId(id):
    mentors = MentorUser.objects.filter(
        user_id=id,
        mentorRole__isnull=False,
        mentorRole__viewsQuestionnaireId__isnull=False
    )
    if not mentors:
        return None
    return mentors.first()


# GET /api/questionnaires/questionnaire/
@api_view(("GET",))
def get_questionnaire(request, headers):
    """
    Fetch the questionnaire assigned by the the mentor
    """
    # Find the questionnaire id from the requesting user
    # mentor = getMentorWithRoleAndQuestionnaireByUserId(request.user.id)
    # if mentor is None:
    #     # todo: error Logging here
    #     FluentLoggingHandler.error(
    #         f"Failed to get questionnaire - Could not find mentor with id: {request.user.id}")
    #     response = Response(status=status.HTTP_404_NOT_FOUND)
    #     return response
    # qid = mentor.mentorRole.viewsQuestionnaireId
    qid = "1"

    headers["Accept"] = "application/json"
    # Fetch questionnaire by id
    url = f"{VIEWS_BASE_URL}evidence/questionnaires/{qid}"

    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        FluentLoggingHandler.error(
            f"Failed to get questionnaire by the following id: {qid}")
        response = Response(status=status.HTTP_404_NOT_FOUND)
        return response

    response = response.json()

    print(response)

    # Construct the data
    data = {}
    data["questionnaireId"] = qid
    data["questions"] = []

    # Extract the question data
    questions = response["questions"].values()
    running_thread = []

    # identity the order of the questions
    index = 0

    print(questions)

    # multithreading for multiple request
    for question in questions:
        running_thread.append(threading.Thread(
            target=fetch_questions, args=(question, data, index, headers)))
        index += 1
    for thread in running_thread:
        thread.start()

    # join
    for thread in running_thread:
        thread.join()

    # sort question base on question order
    data["questions"] = sorted(data["questions"], key=lambda x: x["order"])

    return Response(data, status=status.HTTP_200_OK)


def fetch_questions(question, data, index, headers):
    q = {key: question[key] for key in extractedQuestionFields}
    q["order"] = index
    if (question["valueListID"]):
        value_list_id = question["valueListID"]
        if value_list_id and int(value_list_id) > 0:
            value_list = get_questionnaire_value_lists(value_list_id, headers)
            q["valueList"] = value_list
        else:
            q["valueList"] = []

    data["questions"].append(q)
    return


def get_questionnaire_value_lists(id, headers):
    """
    Fetch the questionnaire value lists for each question
    doc: https://www.substance.net/views/api/index.php/Rest_-_Admin_-_Value_Lists
    """
    value_list_id = id
    if not value_list_id:
        # todo: error Logging here
        response = Response(status=status.HTTP_404_NOT_FOUND)
        FluentLoggingHandler.error(
            f"Failed to get questionnarie value lists - Could not find value list with id: {value_list_id}")
        return response

    headers["Accept"] = "application/json"
    url = f"{VIEWS_BASE_URL}admin/valuelists/{value_list_id}"

    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        FluentLoggingHandler.error(
            f"Failed to get value list with id: {value_list_id}")
        response = Response(status=status.HTTP_404_NOT_FOUND)
        return response

    response = response.json()
    data = {}
    data["items"] = response["items"].values()
    return data


# POST /api/questionnaires/questionnaire/submit/
@api_view(("POST",))
def submit_answer_set(request, headers):
    """
    Submit the answer to the remote Views database
    """
    # Validate data existence
    data = request.data
    if data["questionnaireId"] is None \
            or data["answerSet"] is None \
            or data["person"] is None:
        # todo: error Logging here
        return Response(status=status.HTTP_400_BAD_REQUEST)

    # Find the questionnaire id from the requesting user
    mentor = getMentorWithRoleAndQuestionnaireByUserId(request.user.id)
    if mentor is None:
        FluentLoggingHandler.error(
            f"Failed to submit answer set - Could not find mentor with id: {request.user.id}")
        response = Response(status=status.HTTP_404_NOT_FOUND)
        return response

    # Redundancy check, user won't submit answer set to the wrong question
    qid = mentor.mentorRole.viewsQuestionnaireId
    if data["questionnaireId"] != qid:
        FluentLoggingHandler.error(
            f"{request.user} is sending answer set to the wrong question")
        response = Response(status=status.HTTP_406_NOT_ACCEPTABLE)
        return response

    # Construct answer XML format payload
    answerXMLFormat = (
        '<answer id="{0}">'
        "<QuestionID>{0}</QuestionID>"
        "<Answer>{1}</Answer>"
        "</answer>"
    )
    answersXML = [answerXMLFormat.format(
        id, data["answerSet"][id]) for id in data["answerSet"]]

    url = ""

    # Get the person
    person = data["person"]

    # Construct URL and answer set XML payload depending on whether person is a Mentor or Mentee
    if person == "mentee":
        # Find the Mentee's ID
        # menteeUser = MentorUser.objects.filter(pk=request.user.id)
        mentor_user = MentorUser.objects.filter(pk=request.user.id)
        if not mentor_user.exists():
            FluentLoggingHandler.error(
                f"Failed to submit answer set - Requesting user with id {request.user.id} is not a mentor")
            response = Response(
                "The current requesting user is not a mentor!",
                status=status.HTTP_401_UNAUTHORIZED,
            )
            return response

        mentor_user = mentor_user.first()

        menteeIds = get_mentee_ids_from_mentor(mentor_user, headers=headers)

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
    response = requests.post(url=url, data=answerSetXML, headers=headers)
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

    FluentLoggingHandler.info(
        f"{request.user} has submitted the following answer set data: {data}")

    loggedResponse = Response(responseData, response.status_code)
    return loggedResponse
