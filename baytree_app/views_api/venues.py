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
    return Response(get_venues(request), 200)


def get_venues(request):
    response = requests.get(
        venues_base_url,
        auth=(views_username, views_password),
        headers={
            "Accept": "application/json",
            "Cookie": "access_token=" + request.COOKIES.get('access_token')
        }
    )

    return parse_venues(response)


def parse_venues(response):
    data = response.json()

    # Check if no volunteering types were returned from Views:
    if "items" not in data or data["count"] == data["archivedItems"]:
        return {
            "count": 0,
            "results": [],
        }

    items = data["items"]

    return {
        "count": len(items),
        "results": translate_venue_fields(items),
    }


def translate_venue_fields(venues):
    data = []
    for key in venues:
        strKey = str(key)
        id = int(strKey[8:].strip('\"'))
        name = venues[key]
        data.append({"id": id, "name": name})

    return data