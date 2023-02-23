from users.permissions import MentorPermissions
from .util import try_parse_int
from users.permissions import AdminPermissions
from .constants import views_base_url, views_username, views_password
from rest_framework.decorators import permission_classes, api_view
from rest_framework.response import Response
from rest_framework import status
import requests

participants_base_url = views_base_url + "contacts/participants/"

participantFields = [
    "Forename",
    "Surname",
    "PersonID",
    "Email",
    "DateOfBirth",
    "Ethnicity",
    "County",
    "FirstLanguage_P_88",
]
participantTranslateFields = [
    "firstName",
    "lastName",
    "viewsPersonId",
    "email",
    "dateOfBirth",
    "ethnicity",
    "country",
    "firstLanguage",
]

"""
WHAT IS A PARTICIPANT:
For Baytree's use case of the Views API, Participants in their Views database are the same as Mentees.
These participant records in Views contain contact and general information about the Mentee, .etc.
"""


@api_view(("GET",))
@permission_classes([AdminPermissions | MentorPermissions])
def get_participants_endpoint(request):
    """
    Handles a request from the client browser and calls get_participants
    to return its response to the client.
    """
    ids = request.GET.getlist("id")
    ids = None if ids == [] else ids
    access_token = request.COOKIES.get('access_token')

    if ids != None:
        response = get_participants(ids, access_token=access_token)
    else:
        response = get_participants(
            limit=request.GET.get("limit", None),
            offset=request.GET.get("offset", None),
            access_token=access_token
        )

    return Response(response, status=status.HTTP_200_OK)


def get_participants(ids=None, limit: int = 5, offset: int = 0, access_token=None):
    """
    Gets participants from Views API.
    If an id argument is provided, the participant with a matching PersonId will be returned.
    The limit and offset parameters are used to implement pagination.
    The limit parameter determines how many participants to return from the Views API.
    The offset parameter determines which participant to start at when asking for
    a number of participants from Views when using the limit parameter.
    So, if limit = 5 and offset = 5, this would say: "give me 5 participants,
    but skip the first 5 in the total participants returned by the Views API."
    """

    if ids != None:
        id_filter_string = ""
        for id in ids:
            id_filter_string += "&PersonID[]={}".format(id)

        response = requests.get(
            participants_base_url + "search?" + id_filter_string,
            auth=(views_username, views_password),
            headers={
                "Accept": "application/json",
                "Cookie": f"access_token={access_token}"
            }
        )

    else:
        if limit != None and offset != None:
            response = requests.get(
                participants_base_url
                + "search?q=&pageFold="
                + str(limit)
                + "&offset="
                + str(offset),
                auth=(views_username, views_password),
                headers={
                    "Accept": "application/json",
                    "Cookie": f"access_token={access_token}"
                }
            )
        else:
            response = requests.get(
                participants_base_url + "search?q=",
                auth=(views_username, views_password),
                headers={
                    "Accept": "application/json",
                    "Cookie": f"access_token={access_token}"
                }
            )

    return parse_participants(response)

def get_participant_by_id(id):
    url = f"{participants_base_url}{id}.json"
    response = requests.get(url, auth=(views_username, views_password))
    if response.status_code != 200: return None
    json = response.json()
    data = { newKey: json[oldKey] for (oldKey, newKey) in zip(participantFields, participantTranslateFields)}
    return data


def parse_participants(response):
    parsed = response.json()
    
    firstKey = list(parsed.keys())[0]
    count = int(firstKey[19:].strip('\"'))
    participantsList = parsed[firstKey]

    participants = []
    for participantKey in participantsList:
        participantData = {}
        for i, field in enumerate(participantFields):
            participantData[participantTranslateFields[i]] = try_parse_int(participantsList[participantKey][field])
        participants.append(participantData)

    return {
        "count": count,
        "results": participants,
    }
