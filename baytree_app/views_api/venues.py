import json
from rest_framework.response import Response
from users.permissions import MentorPermissions
from users.models import MentorRole
from users.models import MentorUser

from users.permissions import userIsAdmin, userIsSuperUser
from .constants import views_base_url, views_username, views_password
from rest_framework.decorators import permission_classes, api_view
from rest_framework import status
from users.permissions import AdminPermissions
import requests
import xmltodict

venues_base_url = views_base_url + "admin/valuelists/sessiongroup/venues"


@api_view(("GET",))
@permission_classes([AdminPermissions | MentorPermissions])
def get_venues_endpoint(request):
    return Response(get_venues(), 200)


def get_venues():
    response = requests.get(
        venues_base_url,
        auth=(views_username, views_password),
    )

    return parse_venues(response)


def parse_venues(response):
    parsed = xmltodict.parse(response.text)

    # Check if no volunteering types were returned from Views:
    if not "items" in parsed["valuelist"] or not "item" in parsed["valuelist"]["items"]:
        return {
            "count": 0,
            "results": [],
        }

    items = parsed["valuelist"]["items"]["item"]
    if not isinstance(items, list):
        items = [items]

    return {
        "count": len(items),
        "results": translate_venue_fields(items),
    }


def translate_venue_fields(venues):
    return [{"id": int(venue["@id"]), "name": venue["#text"]} for venue in venues]
