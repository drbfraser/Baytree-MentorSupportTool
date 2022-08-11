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
    "OtherStaff",
]
session_group_translated_fields = [
    "viewsSessionGroupId",
    "name",
    "description",
    "leadStaff",
    "otherStaff",
]

"""
WHAT IS A SESSION GROUP:
For Baytree's use case of the Views API, Session Groups in their Views database hold
all the sessions for a specific mentor role group such as "YS: Youth Mentoring 2021/2022".
Thus, this group would contain all the recorded sessions for Youth Mentors in the 2021/2022
academic year.
"""

MAX_SESSION_GROUPS_PAGE_SIZE = 200


def get_session_groups(
    id: str = None,
    limit: int = None,
    offset: int = None,
    name: str = None,
):
    """
    Gets session groups from Views API.
    If an id argument is provided, the session group with a matching id will be returned.
    The limit and offset parameters are used to implement pagination.
    The limit parameter determines how many session groups to return from the Views API.
    The offset parameter determines which session group to start at when asking for
    a number of session groups from Views when using the limit parameter.
    So, if limit = 5 and offset = 5, this would say: "give me 5 session groups,
    but skip the first 5 in the total session groups returned by the Views API."
    name filters for sessions groups with the given title.

    NOTE: if too many session groups are requested from Views, it will return an out of memory
    error, so make sure to use reasonable pagination in your client browser requests! (200 may be a safe limit)

    Example request/response:
    http://localhost:8000/api/views-api/session-groups?limit=5&offset=2&name=Into%20School

    {
    "total": "1867",
    "data": [
        {
            "viewsSessionGroupId": "153",
            "name": "Into School 2014-2015",
            "description": "Immigrant girls aged 12-19 without a school place can access ESOL and one to one mentoring support to help find a school place.",
            "leadStaff": "16",
            "otherStaff": null
        },
        {
            "viewsSessionGroupId": "208",
            "name": "Into School 2015-2016",
            "description": "mentoring on Tuesday",
            "leadStaff": "1",
            "otherStaff": "762|772|764|768|770|769|406|763|407|765|766|774|771"
        },
        ...]
    }
    """

    # limit page size to prevent out of memory errors returned from Views
    if limit == None or limit > MAX_SESSION_GROUPS_PAGE_SIZE:
        limit = MAX_SESSION_GROUPS_PAGE_SIZE

    if id != None:
        response = requests.get(
            session_groups_base_url + id, auth=(views_username, views_password)
        )

        if response.status_code != 200:
            return None

        parsed = xmltodict.parse(response.text)
        session_group = {
            session_group_translated_fields[i]: parsed["sessiongroup"][field]
            for i, field in enumerate(session_group_fields)
        }
        return session_group
    else:
        request_url = f"{session_groups_base_url}search?q="

        if limit != None:
            request_url += f"&pageFold={limit}"
        if offset != None:
            request_url += f"&offset={offset}"
        if name != None:
            request_url += f"&Title={name}"

        response = requests.get(request_url, auth=(views_username, views_password))

        parsed = xmltodict.parse(response.text)
        if "sessiongroup" in parsed["work"]["sessiongroups"]:
            parsed_session_group_list = parsed["work"]["sessiongroups"]["sessiongroup"]
            if not isinstance(parsed_session_group_list, list):
                parsed_session_group_list = [parsed_session_group_list]
            session_groups = [
                {
                    session_group_translated_fields[i]: sessionGroup[field]
                    for i, field in enumerate(session_group_fields)
                }
                for sessionGroup in parsed_session_group_list
            ]
            return {
                "total": parsed["work"]["sessiongroups"]["@count"],
                "data": session_groups,
            }
        else:
            return {"total": parsed["work"]["sessiongroups"]["@count"], "data": []}


@api_view(("GET",))
@permission_classes((AdminPermissions,))
def get_session_groups_endpoint(request):
    """
    Handles a request from the client browser and calls get_session_groups
    to return its response to the client.
    """
    id = request.GET.get("id", None)

    if id != None:
        response = get_session_groups(id)
        if not response:
            return Response("Not Found", status=status.HTTP_404_NOT_FOUND)
    else:
        response = get_session_groups(
            limit=request.GET.get("limit", None),
            offset=request.GET.get("offset", None),
            name=request.GET.get("name", None),
        )

    return Response(response, status=status.HTTP_200_OK)
