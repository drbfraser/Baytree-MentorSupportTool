from rest_framework.response import Response
from users.permissions import MentorPermissions
from users.models import MentorRole
from users.models import MentorUser
import json

from sessions.permissions import userIsAdmin, userIsSuperUser
from .constants import views_base_url, views_username, views_password
from rest_framework.decorators import permission_classes, api_view
from rest_framework import status
from users.permissions import AdminPermissions
import requests
import xmltodict

volunteering_types_base_url = (
    views_base_url + "admin/valuelists/sessiongroup/volunteeringtypes"
)


@api_view(("GET",))
@permission_classes([AdminPermissions | MentorPermissions])
def get_volunteering_types_endpoint(request):
    return Response(get_volunteering_types(), 200)


def get_volunteering_types():
    response = requests.get(
        volunteering_types_base_url,
        auth=(views_username, views_password),
        headers={"Accept": "application/json"},
    )

    return parse_volunteering_types(response)


def parse_volunteering_types(response):
    parsed = json.loads(response.text)

    # Check if no volunteering types were returned from Views:
    if not "items" in parsed or len(parsed["items"]) == 0:
        return {
            "count": 0,
            "results": [],
        }

    return {
        "count": len(parsed["items"]),
        "results": translate_volunteering_type_fields(parsed["items"]),
    }


def translate_volunteering_type_fields(volunteering_types):
    return [val for val in volunteering_types.values()]
