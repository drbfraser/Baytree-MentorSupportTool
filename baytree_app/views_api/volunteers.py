from typing import List, Union
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


@api_view(("GET",))
@permission_classes((AdminPermissions,))
def get_volunteers_endpoint(request):
    """
    Handles a request from the client browser and calls get_volunteers
    to return its response to the client.
    """
    id = request.GET.getlist("id")
    id = None if id == [] else id
    searchEmail = request.GET.get("searchEmail", None)
    searchFirstName = request.GET.get("searchFirstName", None)
    searchLastName = request.GET.get("searchLastName", None)

    if searchEmail != None and searchEmail != "":
        response = get_volunteers(
            limit=request.GET.get("limit", None),
            offset=request.GET.get("offset", None),
            searchEmail=searchEmail,
        )
    elif searchFirstName or searchLastName:
        response = get_volunteers(
            limit=request.GET.get("limit", None),
            offset=request.GET.get("offset", None),
            searchFirstName=searchFirstName,
            searchLastName=searchLastName,
        )
    elif id != None:
        response = get_volunteers(id)
    else:
        response = get_volunteers(
            limit=request.GET.get("limit", None), offset=request.GET.get("offset", None)
        )

    return Response(response, status=status.HTTP_200_OK)


def get_volunteers(
    id: Union[List[str], str] = None,
    limit: int = None,
    offset: int = None,
    searchEmail: str = None,
    searchFirstName: str = None,
    searchLastName: str = None,
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

        return parse_volunteers(response)

    elif searchFirstName or searchLastName:
        if limit != None:
            views_request_url += "&pageFold=" + str(limit)

        if offset != None:
            views_request_url += "&offset=" + str(offset)

        views_request_url = "{}search?".format(volunteers_base_url)

        if searchFirstName:
            views_request_url += "&Forename={}".format(searchFirstName)

        if searchLastName:
            views_request_url += "&Surname={}".format(searchLastName)

        response = requests.get(
            views_request_url, auth=(views_username, views_password)
        )

        return parse_volunteers(response)

    elif id != None:
        ids = id
        if not isinstance(id, list):
            ids = [id]

        views_request_url = "{}search?".format(volunteers_base_url)

        for id in ids:
            views_request_url += "&PersonID[]={}".format(id)

        response = requests.get(
            views_request_url, auth=(views_username, views_password)
        )

        return parse_volunteers(response)

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

        return parse_volunteers(response)


def parse_volunteers(response):
    parsed = xmltodict.parse(response.text)

    # Check if no volunteers were returned from Views:
    if parsed["contacts"]["volunteers"]["@count"] == "0":
        return {
            "total": 0,
            "data": [],
        }

    # Make sure the volunteers are wrapped in a list, if there is a single volunteer
    volunteers = parsed["contacts"]["volunteers"]["volunteer"]
    if not isinstance(volunteers, list):
        volunteers = [volunteers]

    return {
        "total": int(parsed["contacts"]["volunteers"]["@count"]),
        "data": translate_volunteer_fields(volunteers),
    }


def translate_volunteer_fields(volunteers):
    return [
        {
            volunteerTranslateFields[i]: volunteer[field]
            for i, field in enumerate(volunteerFields)
        }
        for volunteer in volunteers
    ]
