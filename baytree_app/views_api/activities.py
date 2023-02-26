from rest_framework.response import Response
from users.permissions import MentorPermissions
from users.models import MentorRole
from users.models import MentorUser
import json

from users.permissions import userIsAdmin, userIsSuperUser
from .constants import views_base_url, views_username, views_password
from rest_framework.decorators import permission_classes, api_view
from rest_framework import status
from users.permissions import AdminPermissions
import requests
import xmltodict

activities_base_url = views_base_url + "admin/valuelists/sessiongroup/agencyactivities"


@api_view(("GET",))
@permission_classes([AdminPermissions | MentorPermissions])
def get_activities_endpoint(request, headers):
    return Response(get_activities(headers), 200)


def get_activities(headers):
    response = requests.get(
        activities_base_url,
        headers=headers,
    )
    print("ACTIVITIES!!")
    print(response.text)

    return parse_activities(response)


def parse_activities(response):
    parsed = json.loads(response.text)

    # Check if no activities were returned from Views:
    if not "items" in parsed or len(parsed["items"]) == 0:
        return {
            "count": 0,
            "results": [],
        }

    return {
        "count": len(parsed["items"]),
        "results": translate_activity_fields(parsed["items"]),
    }


def translate_activity_fields(activities):
    return [val for val in activities.values()]
