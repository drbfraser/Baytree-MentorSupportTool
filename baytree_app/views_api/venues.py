import json
from rest_framework.response import Response
from users.permissions import MentorPermissions
from users.models import MentorRole
from users.models import MentorUser

from sessions.permissions import userIsAdmin, userIsSuperUser
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
        headers={"Accept": "application/json"},
    )

    return parse_venues(response)


def parse_venues(response):
    parsed = json.loads(response.text)

    # Check if no volunteering types were returned from Views:
    if not "items" in parsed or len(parsed["items"]) == 0:
        return {
            "count": 0,
            "results": [],
        }

    return {
        "count": len(parsed["items"]),
        "results": translate_venue_fields(parsed["items"]),
    }


def translate_venue_fields(venues):
    return [val for val in venues.values()]
