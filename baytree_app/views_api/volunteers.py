import requests
import xmltodict
from baytree_app.constants import (VIEWS_BASE_URL)
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from users.models import MentorUser
from users.permissions import AdminPermissions
from rest_framework.views import APIView
from users.serializers import MentorSerializer

volunteers_base_url = VIEWS_BASE_URL + "contacts/volunteers"

volunteerFields = [
    "Forename",
    "Surname",
    "PersonID",
    "Email",
    "DateOfBirth",
    "Ethnicity_V_15",
    "County",
    "Whatisyourfirstlanguage_V_19",
]
volunteerTranslateFields = [
    "firstname",
    "surname",
    "viewsPersonId",
    "email",
    "dateOfBirth",
    "ethnicity",
    "country",
    "firstLanguage",
]


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
def get_volunteers(request):
    """
    Handles a request from the client browser and calls get_volunteers
    to return its response to the client.
    """
    headers = {
        "Authorization": request.META["VIEWS_AUTHORIZATION"],
        "Accept": "application/xml"
    }

    id_list = request.GET.getlist("id", [])
    searchEmail = request.GET.get("searchEmail", '')
    searchFirstName = request.GET.get("searchFirstName", '')
    searchLastName = request.GET.get("searchLastName", '')
    offset = request.GET.get("offset", '')
    limit = request.GET.get("limit", '')

    views_request_url = volunteers_base_url + '/search?'

    if id_list:
        for id in id_list:
            views_request_url += "&PersonID[]={}".format(id)

    views_request_url += '&Email=' + searchEmail
    views_request_url += '&Forename=' + searchFirstName
    views_request_url += '&Surname=' + searchLastName
    views_request_url += '&pageFold=' + str(limit)
    views_request_url += '&offset=' + str(offset)

    response = requests.get(
                    views_request_url,
                    headers=headers
                    )
    return Response(
        data=parse_volunteers(response),
        status=200
    )

class JointMentorsAndVolunteersData(APIView):
    def get(self, request):
        request = request._request
        mentors_from_db = MentorUser.objects.all()
        response = get_volunteers(request)
        joined_data = join_views_volunteers_to_mentor_users(
            mentors_from_db,
            response.data["data"]
        )
        return Response({
            "count": len(joined_data),
            "results": joined_data
        })

def join_views_volunteers_to_mentor_users(mentor_users, views_volunteers):
        inner_join_result = []

        for m_user in mentor_users:
            if isinstance(m_user, MentorUser):
                v_match = next(
                    filter(
                        lambda v: v["viewsPersonId"] == '5853',
                        views_volunteers,
                    ),
                    None,
                )

                if v_match:
                    m_user = MentorSerializer(m_user).data
                    m_user["firstName"] = v_match["firstname"]
                    m_user["lastName"] = v_match["surname"]
                    inner_join_result.append(m_user)

            else:
                v_match = next(
                    filter(
                        lambda v: v["viewsPersonId"] == m_user["viewsPersonId"],
                        views_volunteers,
                    ),
                    None,
                )

                if v_match:
                    m_user["firstName"] = v_match["firstname"]
                    m_user["lastName"] = v_match["surname"]
                    inner_join_result.append(m_user)

        return inner_join_result


def parse_volunteers(response):
    parsed = xmltodict.parse(response.text)

    # Check if no volunteers were returned from Views:
    if parsed["contacts"]["volunteers"]["@count"] == "0":
        return {
            "total": 0,
            "data": [],
        }

    # Make sure the volunteers are wrapped in a list, if there is a single volunteer
    volunteers = parsed["contacts"]["volunteers"]["volunteer"]
    if not isinstance(volunteers, list):
        volunteers = [volunteers]

    return {
        "total": int(parsed["contacts"]["volunteers"]["@count"]),
        "data": translate_volunteer_fields(volunteers),
    }


def translate_volunteer_fields(volunteers):
    return [
        {
            volunteerTranslateFields[i]: volunteer[field]
            for i, field in enumerate(volunteerFields)
        }
        for volunteer in volunteers
    ]


# GET /api/views-api/volunteers/volunteer/
@api_view(("GET", ))
def get_volunteer_profile(request):
    """
    Fetch the detailed volunteer profile
    based on the requesting user
    """
    headers = {
        "Authorization": request.META["VIEWS_AUTHORIZATION"],
        "Accept": "application/xml"
    }
    mentors = MentorUser.objects.filter(user_id=request.user.id)
    if not mentors:
        return Response(status=status.HTTP_404_NOT_FOUND)
    mentorViewsId = mentors.first().viewsPersonId
    response = get_volunteers(id=str(mentorViewsId), headers=headers)
    return Response(response, status=status.HTTP_200_OK)
