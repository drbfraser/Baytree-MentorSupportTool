from rest_framework.response import Response
from users.permissions import MentorPermissions
from .util import parse_valuelist_items

from baytree_app.constants import VIEWS_BASE_URL
from rest_framework.decorators import permission_classes, api_view
from users.permissions import AdminPermissions
import requests
from baytree_app.FluentLoggingHandler import FluentLoggingHandler

volunteering_types_base_url = (
    VIEWS_BASE_URL + "admin/valuelists/sessiongroup/volunteeringtypes"
)

@api_view(("GET",))
@permission_classes([AdminPermissions | MentorPermissions])
def get_volunteering_types_endpoint(request):
    headers = {
        "Authorization": request.META["VIEWS_AUTHORIZATION"],
        "Accept": "application/json"
    }
    return Response(get_volunteering_types(headers), 200)

def get_volunteering_types(headers):

  try:
    response = requests.get(
        volunteering_types_base_url,
        headers=headers,
    )

    parsed_data = parse_valuelist_items(response)
    return parsed_data
  except Exception as e:
    FluentLoggingHandler.warning(f"An error occurred while getting volunteering types:{e}")