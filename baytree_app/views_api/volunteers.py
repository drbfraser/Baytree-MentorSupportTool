from django.http import HttpResponse
from .participants import get_participant_by_id
from users.models import MentorUser
from .permissions import MentorsViewsApiPermissions
from users.permissions import AdminPermissions
from .constants import views_base_url, views_username, views_password
from rest_framework.decorators import permission_classes, api_view
from rest_framework.response import Response
from rest_framework import status
import requests
import xmltodict

volunteers_base_url = views_base_url + "contacts/volunteers/"

volunteerFields = [
    "Forename",
    "Surname",
    "PersonID",
    "Email",
    "DateOfBirth",
    "Ethnicity_V_15",
    "County",
]
volunteerTranslateFields = [
    "firstname",
    "surname",
    "viewsPersonId",
    "email",
    "dateOfBirth",
    "ethnicity",
    "country",
]

"""
WHAT IS A VOUNTEER:
For Baytree's use case of the Views API, Volunteers in their Views database are the same as Mentors.
These Mentor records in Views contain contact and general information about the Mentor, .etc.
Mentors are also considered as "Staff", but not all staff are mentors, so we shouldn't retrieve
staff members since we could retrieve members that aren't actually mentors.
"""


def get_volunteers(
    id: str = None, limit: int = 5, offset: int = 0, searchEmail: str = None
):
    """
    Gets volunteers from Views API.
    If an id argument is provided, the volunteer with a matching PersonId will be returned.
    The limit and offset parameters are used to implement pagination.
    The limit parameter determines how many vounteers to return from the Views API.
    The offset parameter determines which volunteer to start at when asking for
    The searchEmail parameter filters for volunteers by email.
    a number of volunteers from Views when using the limit parameter.
    So, if limit = 5 and offset = 5, this would say: "give me 5 volunteers,
    but skip the first 5 in the total volunteers returned by the Views API."
    """

    if searchEmail != None and searchEmail != "":
        views_request_url = volunteers_base_url + "search?Email=" + searchEmail

        if limit != None:
            views_request_url += "&pageFold=" + str(limit)

        if offset != None:
            views_request_url += "&offset=" + str(offset)

        response = requests.get(
            views_request_url, auth=(views_username, views_password)
        )

        parsed = xmltodict.parse(response.text)

        # Check if no volunteers were returned from Views:
        if parsed["contacts"]["volunteers"]["@count"] == "0":
            return {"total": parsed["contacts"]["volunteers"]["@count"], "data": []}

        # Make sure the volunteers are wrapped in a list, if there is a single volunteer
        if not isinstance(parsed["contacts"]["volunteers"]["volunteer"], list):
            parsed["contacts"]["volunteers"]["volunteer"] = [
                parsed["contacts"]["volunteers"]["volunteer"]
            ]

        volunteers = [
            {
                volunteerTranslateFields[i]: volunteer[field]
                for i, field in enumerate(volunteerFields)
            }
            for volunteer in parsed["contacts"]["volunteers"]["volunteer"]
        ]

        return {"total": parsed["contacts"]["volunteers"]["@count"], "data": volunteers}

    elif id != None:
        response = requests.get(
            volunteers_base_url + id, auth=(views_username, views_password)
        )
        parsed = xmltodict.parse(response.text)
        volunteer = {
            volunteerTranslateFields[i]: parsed["volunteer"][field]
            for i, field in enumerate(volunteerFields)
        }
        return volunteer
    else:
        if limit != None:
            if offset == None:
                offset = 0
            response = requests.get(
                volunteers_base_url
                + "search?q=&pageFold="
                + str(limit)
                + "&offset="
                + str(offset),
                auth=(views_username, views_password),
            )
        else:
            response = requests.get(
                volunteers_base_url + "search?q=", auth=(views_username, views_password)
            )

        parsed = xmltodict.parse(response.text)

        # Make sure the volunteers are wrapped in a list, if there is a single volunteer
        if not isinstance(parsed["contacts"]["volunteers"]["volunteer"], list):
            parsed["contacts"]["volunteers"]["volunteer"] = [
                parsed["contacts"]["volunteers"]["volunteer"]
            ]

        volunteers = [
            {
                volunteerTranslateFields[i]: volunteer[field]
                for i, field in enumerate(volunteerFields)
            }
            for volunteer in parsed["contacts"]["volunteers"]["volunteer"]
        ]
        return {"total": parsed["contacts"]["volunteers"]["@count"], "data": volunteers}


@api_view(("GET",))
@permission_classes([AdminPermissions | MentorsViewsApiPermissions])
def get_volunteers_endpoint(request):
    """
    Handles a request from the client browser and calls get_volunteers
    to return its response to the client.
    """
    id = request.GET.get("id", None)
    searchEmail = request.GET.get("searchEmail", None)

    if searchEmail != None and searchEmail != "":
        response = get_volunteers(
            limit=request.GET.get("limit", None),
            offset=request.GET.get("offset", None),
            searchEmail=searchEmail,
        )
    elif id != None:
        response = get_volunteers(id)
    else:
        response = get_volunteers(
            limit=request.GET.get("limit", None), offset=request.GET.get("offset", None)
        )

    return Response(response, status=status.HTTP_200_OK)

# GET api/views-api/volunteer/participants/
@api_view(("GET",))
def get_participant_by_volunteer(request): 
    # Get mentee views id
    mentors = MentorUser.objects.filter(user_id=request.user.id)
    
    if not mentors:
        return Response([], status=status.HTTP_404_NOT_FOUND)

    mentorViewsId = mentors.first().viewsPersonId

    # Get the mentee id from association field
    url = f"{views_base_url}contacts/staff/{mentorViewsId}/associations?q=Mentee"
    response = requests.get(url, auth=(views_username, views_password))
    data = xmltodict.parse(response.text)
    menteeId = data["staff"]["associations"]["association"]["MasterID"]

    # Get the mentee profile from mentee id
    return get_participant_by_id(menteeId)