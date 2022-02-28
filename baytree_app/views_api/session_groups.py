from rest_framework.response import Response
from .constants import views_base_url, views_username, views_password
from rest_framework.decorators import permission_classes, api_view
from rest_framework import status
from users.permissions import AdminPermissions
import requests
import xmltodict

session_groups_base_url = views_base_url + "work/sessiongroups/"

session_group_fields = [
    "SessionGroupID",
    "Title",
    "Description",
    "LeadStaff",
    "OtherStaff"
]
session_group_translated_fields = [
    "viewsSessionGroupId",
    "name",
    "description",
    "leadStaff",
    "otherStaff"
]

def get_session_groups(id: str = None, limit: int = None, offset: int = None):
    """
    Gets session groups from Views API.
    If an id argument is provided, the session group with a matching id will be returned.
    The limit and offset parameters are used to implement pagination.
    The limit parameter determines how many session groups to return from the Views API.
    The offset parameter determines which session group to start at when asking for
    a number of session groups from Views when using the limit parameter.
    So, if limit = 5 and offset = 5, this would say: "give me 5 session groups,
    but skip the first 5 in the total session groups returned by the Views API."
    """

    if id != None:
        response = requests.get(session_groups_base_url + id, auth=(views_username, views_password))
        parsed = xmltodict.parse(response.text)
        session_group = {session_group_translated_fields[i]: parsed["sessiongroup"][field]
                     for i, field in enumerate(session_group_fields)}
        return session_group
    else:
        if limit != None and offset != None:
            response = requests.get(
                session_groups_base_url + "search?q=&pageFold=" +
                str(limit) + "&offset=" + str(offset),
                auth=(views_username, views_password))
        else:
            response = requests.get(
                session_groups_base_url + "search?q=",
                auth=(views_username, views_password))
        parsed = xmltodict.parse(response.text)
        if "sessiongroup" in parsed["work"]["sessiongroups"]:
            parsed_session_group_list = parsed["work"]["sessiongroups"]["sessiongroup"]
            if not isinstance(parsed_session_group_list, list):
                parsed_session_group_list = [parsed_session_group_list]
            session_groups = [{session_group_translated_fields[i]: sessionGroup[field] for i, field in enumerate(session_group_fields)}
                        for sessionGroup in parsed_session_group_list]
            return {"total": parsed["work"]["sessiongroups"]["@count"], "data": session_groups}
        else:
            return {"total": parsed["work"]["sessiongroups"]["@count"], "data": []}

@api_view(('GET',))
@permission_classes((AdminPermissions, ))
def get_session_groups_endpoint(request):
    """
    Handles a request from the client browser and calls get_session_groups
    to return its response to the client.
    """
    id = request.GET.get('id', None)

    if id != None:
        response = get_session_groups(id)
    else:
        response = get_session_groups(limit=request.GET.get(
            'limit', None), offset=request.GET.get('offset', None))

    return Response(response, status=status.HTTP_200_OK)