from rest_framework.response import Response
from users.permissions import MentorPermissions
import json

from .constants import views_base_url
from rest_framework.decorators import permission_classes, api_view
from users.permissions import AdminPermissions
import requests
from baytree_app.FluentLoggingHandler import FluentLoggingHandler

volunteering_types_base_url = (
    views_base_url + "admin/valuelists/sessiongroup/volunteeringtypes"
)

@api_view(("GET",))
@permission_classes([AdminPermissions | MentorPermissions])
def get_volunteering_types_endpoint(request, headers):
    return Response(get_volunteering_types(headers), 200)

def get_volunteering_types(headers):

  # TO DO: This should be removed once we switch to XML.
  headers["Accept"]= "application/json"

  try:
    response = requests.get(
        volunteering_types_base_url,
        headers=headers,
    )

    parsed_data = parse_volunteering_types(response)
    return parsed_data
  except Exception as e:
    FluentLoggingHandler.warning("An error occurred while getting volunteering types:", e)

def parse_volunteering_types(response):
    parsed = json.loads(response.text)

    # Check if no volunteering types were returned from Views:
    if "items" not in parsed or len(parsed["items"]) == 0:
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
