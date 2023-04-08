from rest_framework.response import Response
from users.permissions import MentorPermissions

from .constants import views_base_url
from rest_framework.decorators import permission_classes, api_view
from users.permissions import AdminPermissions
import requests
import xmltodict

venues_base_url = views_base_url + "admin/valuelists/sessiongroup/venues"


@api_view(("GET",))
@permission_classes([AdminPermissions | MentorPermissions])
def get_venues_endpoint(request):
    headers = {
        "Authorization": request.META["VIEWS_AUTHORIZATION"],
        "Accept": "application/xml"
    }
    return Response(get_venues(headers), 200)


def get_venues(headers):
    response = requests.get(
        venues_base_url,
        headers=headers,
    )

    return parse_venues(response)


def parse_venues(response):
    decoded = response.text.encode("utf-8").decode("unicode_escape").strip('\"')
    parsed = xmltodict.parse(decoded)

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