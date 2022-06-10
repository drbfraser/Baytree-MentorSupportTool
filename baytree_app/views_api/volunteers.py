from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from users.models import MentorUser
from users.permissions import AdminPermissions
from rest_framework import status
from .util import get_volunteers, get_sessions

"""
WHAT IS A VOUNTEER:
For Baytree's use case of the Views API, Volunteers in their Views database are the same as Mentors.
These Mentor records in Views contain contact and general information about the Mentor, .etc.
Mentors are also considered as "Staff", but not all staff are mentors, so we shouldn't retrieve
staff members since we could retrieve members that aren't actually mentors.
"""

# GET /api/volunteers
@api_view(("GET",))
@permission_classes((AdminPermissions,))
def get_volunteers_endpoint(request):
    """
    Handles a request from the client browser and calls get_volunteers
    to return its response to the client.
    """
    id = request.GET.getlist("id")
    id = None if id == [] else id
    searchEmail = request.GET.get("searchEmail", None)
    searchFirstName = request.GET.get("searchFirstName", None)
    searchLastName = request.GET.get("searchLastName", None)

    if searchEmail != None and searchEmail != "":
        response = get_volunteers(
            limit=request.GET.get("limit", None),
            offset=request.GET.get("offset", None),
            searchEmail=searchEmail,
        )
    elif searchFirstName or searchLastName:
        response = get_volunteers(
            limit=request.GET.get("limit", None),
            offset=request.GET.get("offset", None),
            searchFirstName=searchFirstName,
            searchLastName=searchLastName,
        )
    elif id != None:
        response = get_volunteers(id)
    else:
        response = get_volunteers(
            limit=request.GET.get("limit", None), offset=request.GET.get("offset", None)
        )

    return Response(response, status=status.HTTP_200_OK)

# GET /api/views-api/volunteers/volunteer/
@api_view(("GET", ))
def get_volunteer_profile(request):
    """
    Fetch the detailed volunteer profile
    based on the requesting user
    """
    mentors = MentorUser.objects.filter(user_id=request.user.id)
    if not mentors:
        return Response(status=status.HTTP_404_NOT_FOUND)
    mentorViewsId = mentors.first().viewsPersonId
    response = get_volunteers(id=str(mentorViewsId))
    return Response(response, status=status.HTTP_200_OK)


queryKeys = ["sessionGroupId", "limit", "offset", "startDateFrom", "startDateTo"]

# GET /api/views-api/volunteers/volunteer/sessions
@api_view(("GET", ))
def get_session_by_volunteer(request):
    mentors = MentorUser.objects.filter(user_id=request.user.id)
    if not mentors:
        return Response(status=status.HTTP_404_NOT_FOUND)
    params = { key: request.GET.get(key, None) for key in queryKeys }
    params["personId"] = mentors.first().viewsPersonId
    sessions = get_sessions(**params)
    return Response(sessions, status=status.HTTP_200_OK)
