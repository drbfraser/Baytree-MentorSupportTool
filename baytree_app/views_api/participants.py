from users.permissions import MentorPermissions
from .util import try_parse_int
from users.permissions import AdminPermissions
from baytree_app.constants import VIEWS_BASE_URL
from rest_framework.decorators import permission_classes, api_view
from rest_framework.response import Response
import requests
import xmltodict
import aiohttp
from rest_framework.renderers import JSONRenderer

participants_base_url = VIEWS_BASE_URL + "contacts/participants/"

participant_fields = [
    "Forename",
    "Surname",
    "PersonID",
    "Email",
    "DateOfBirth",
    "Ethnicity",
    "Countryofbirth_P_87",
    "FirstLanguage_P_88",
]
participant_translate_fields = [
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
@permission_classes([AdminPermissions | MentorPermissions])
async def get_participants(request):
    """
    Handles a request from the client browser and calls get_participants
    to return its response to the client.
    """
    headers = {
        "Authorization": request.META["VIEWS_AUTHORIZATION"],
        "Accept": "application/xml"
    }

    id_list = request.GET.getlist("id", [])
    searchEmail = request.GET.get("searchEmail", '')
    searchFirstName = request.GET.get("searchFirstName", '')
    searchLastName = request.GET.get("searchLastName", '')
    offset = request.GET.get("offset", '')
    limit = request.GET.get("limit", '')

    views_request_url = participants_base_url + '/search?'

    if id_list:
        for id in id_list:
            views_request_url += "&PersonID[]={}".format(id)

    views_request_url += '&Email=' + searchEmail
    views_request_url += '&Forename=' + searchFirstName
    views_request_url += '&Surname=' + searchLastName
    views_request_url += '&pageFold=' + str(limit)
    views_request_url += '&offset=' + str(offset)

    async with aiohttp.ClientSession(headers=headers) as session:
      async with session.get(views_request_url) as response:
          response_data = await response.text()
          parsed_data = parse_participants(response_data)
          response = Response(data=parsed_data, status=200)
          response.accepted_renderer= JSONRenderer()
          response.accepted_media_type = 'application/json'
          response.renderer_context = {}
          return response


def get_participant_by_id(id, headers):
    headers["Accept"] = "application/json"
    url = f"{participants_base_url}{id}"
    response = requests.get(url, headers=headers)
    if response.status_code != 200: return None
    json = response.json()
    data = { newKey: json[oldKey] for (oldKey, newKey) in zip(participant_fields, participant_translate_fields)}
    return data


def parse_participants(response):
    # Remove invalid tags
    response_text = response.replace(
        "<2Personrelationshipandcontactnumberofpersonauthorised_P_229/>", ""
    )
    decoded = response_text.encode("utf-8").decode("unicode_escape").strip('\"')
    parsed_response = xmltodict.parse(decoded)
    wrapped_xml = parsed_response.get("root", None)
    parsed_xml = xmltodict.parse(wrapped_xml) if wrapped_xml else parsed_response

    # Make sure the participants are wrapped in a list, if there is a single participant
    if not isinstance(parsed_xml["contacts"]["participants"]["participant"], list):
        parsed_xml["contacts"]["participants"]["participant"] = [
            parsed_xml["contacts"]["participants"]["participant"]
        ]

    participants = [
        {
            participant_translate_fields[i]: try_parse_int(participant[field])
            for i, field in enumerate(participant_fields)
        }
        for participant in parsed_xml["contacts"]["participants"]["participant"]
    ]

    return {
        "count": int(parsed_xml["contacts"]["participants"]["@count"]),
        "results": participants,
    }
