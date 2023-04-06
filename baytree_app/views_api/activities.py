from rest_framework.response import Response
from users.permissions import MentorPermissions
from .util import parse_valuelist_items
from .constants import views_base_url
from rest_framework.decorators import permission_classes, api_view
from users.permissions import AdminPermissions
import requests

activities_base_url = views_base_url + "admin/valuelists/sessiongroup/agencyactivities"


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
    return parse_valuelist_items(response)