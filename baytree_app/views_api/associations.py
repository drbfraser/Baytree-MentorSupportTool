from rest_framework.response import Response

from .participants import get_participants
from .util import try_parse_int
from users.models import MentorUser

from sessions.permissions import userIsAdmin, userIsSuperUser
from .constants import views_base_url, views_username, views_password
from rest_framework.decorators import api_view
import requests
import xmltodict
from rest_framework import status

participant_associations_base_url = (
    views_base_url + "contacts/participants/{}/associations"
)
staff_associations_base_url = views_base_url + "contacts/staff/{}/associations"

association_views_response_fields = [
    "AssociationID",
    "MasterType",  # ex. "Person" for participant
    "MasterID",  # PersonID of the person who owns the association (participant/mentee owns it typically)
    "SlaveType",  # Type of related person (volunteer is staff, so this would be "Staff" for mentor, "Person" for family)
    "SlaveID",  # PersonID of related person (typically mentor/volunteer id)
    "Association",  # Master person's role to slave person ex. Mentee, Mother to slave person
    "Description",  # Describe association (may be empty)
    "StartDate",  # ex. 2021-07-07
    "EndDate",  # ex. 0000-00-00
]
association_translated_fields = [
    "associationId",
    "masterType",  # ex. "Person" for participant
    "masterId",  # PersonID of the person who owns the association (participant/mentee owns it typically)
    "slaveType",  # Type of related person (volunteer is staff, so this would be "Staff" for mentor, "Person" for family)
    "slaveId",  # PersonID of related person (typically mentor/volunteer id)
    "association",  # Master person's role to slave person ex. Mentee, Mother to slave person
    "description",  # Describe association (may be empty)
    "startDate",  # ex. 2021-07-07
    "endDate",  # ex. 0000-00-00
]

"""
WHAT IS AN ASSOCIATION:
An association keeps track of which "Persons" in the Views database are
related to other "Persons". For instance, a person who is a participant (Mentee)
could be related to a volunteer person (Mentor), so an association record would exist
between the two. A "Association" field of the association record will help tell
whether the related person to a participant is a family member, or mentor, .etc
For instance, if the association is "Mentee", the "master" Person is a Mentee of the "slave" Person (a mentor)
"""


@api_view(("GET",))
def get_associations_endpoint(request):
    volunteer_id = request.GET.get("volunteerId", None)
    if volunteer_id:
        if (not userIsAdmin(request.user)) and (not userIsSuperUser(request.user)):
            mentor_user = MentorUser.objects.filter(pk=request.user.id)
            if not mentor_user.exists():
                return Response("You are not authorized to access this resource.", 401)
            mentor_user = mentor_user.first()

            if mentor_user.viewsPersonId != volunteer_id:
                return Response("You are not authorized to access this resource.", 401)

        return Response(get_associations(volunteer_id=volunteer_id), 200)


def get_associations(volunteer_id):

    response = requests.get(
        staff_associations_base_url.format(volunteer_id),
        auth=(views_username, views_password),
    )

    return parse_associations(response)


def parse_associations(response):
    parsed = xmltodict.parse(response.text)

    # Check if no associations were returned from Views:
    if (
        not parsed["staff"]["associations"]
        or not "association" in parsed["staff"]["associations"]
    ):
        return {
            "count": 0,
            "results": [],
        }

    # Make sure the associations are wrapped in a list, if there is a single association
    associations = parsed["staff"]["associations"]["association"]
    if not isinstance(associations, list):
        associations = [associations]

    return {
        "count": len(associations),
        "results": translate_association_fields(associations),
    }


def translate_association_fields(associations):
    return [
        {
            association_translated_fields[i]: try_parse_int(association[field])
            for i, field in enumerate(association_views_response_fields)
        }
        for association in associations
    ]


@api_view(("GET",))
def get_mentees_for_mentor(request):
    mentor_user = MentorUser.objects.filter(pk=request.user.id)
    if not mentor_user.exists():
        return Response(
            "The current requesting user is not a mentor!",
            status=status.HTTP_401_UNAUTHORIZED,
        )
    mentor_user = mentor_user.first()

    associations = get_associations(mentor_user.viewsPersonId)

    menteeIds = []
    for association in associations["results"]:
        if association["association"] == "Mentee":
            menteeIds.append(association["masterId"])

    participants = get_participants(menteeIds)

    return Response(participants["results"], status.HTTP_200_OK)
