from rest_framework.response import Response
from users.permissions import MentorPermissions
import json

from baytree_app.constants import VIEWS_BASE_URL
from rest_framework.decorators import permission_classes, api_view
from users.permissions import AdminPermissions
import requests

activities_base_url = VIEWS_BASE_URL + "admin/valuelists/sessiongroup/agencyactivities"

@api_view(("GET",))
@permission_classes([AdminPermissions | MentorPermissions])

def get_activities_endpoint(request):
    headers = {
        "Authorization": request.META["VIEWS_AUTHORIZATION"],
        "Accept": "application/json"
    }
    return Response(get_activities(headers), 200)

def get_activities(headers):

    response = requests.get(
        activities_base_url,
        headers=headers,
    )
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
