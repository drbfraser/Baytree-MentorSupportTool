from rest_framework.response import Response
from users.permissions import MentorPermissions
from users.models import MentorRole
from users.models import MentorUser

from sessions.permissions import userIsAdmin, userIsSuperUser
from .constants import views_base_url, views_username, views_password
from rest_framework.decorators import permission_classes, api_view
from rest_framework import status
from users.permissions import AdminPermissions
import requests
import xmltodict

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
    "Association",  # Role of slave/related person ex. Mentor, Mother
    "Description",  # Describe association (may be empty)
    "StartDate",  # ex. 2021-07-07
    "EndDate",  # ex. 0000-00-00
]
association_translated_fields = [
    "associationId",
    "masterType",  # ex. "Person" for participant
    "masterId",  # PersonID of this person
    "slaveType",  # Type of related person (volunteer is staff, so this would be "Staff" for mentor, "Person" for family)
    "slaveId",  # PersonID of related person
    "association",  # ex. Mentor, Mother
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
    if not "association" in parsed["staff"]["associations"]:
        return {
            "count": 0,
            "results": [],
        }

    # Make sure the associations are wrapped in a list, if there is a single association
    associations = parsed["staff"]["associations"]["association"]
    if not isinstance(associations, list):
        associations = [associations]

    return {
        "count": len(parsed["staff"]["associations"]["association"]),
        "results": translate_association_fields(associations),
    }


def translate_association_fields(associations):
    return [
        {
            association_translated_fields[i]: association[field]
            for i, field in enumerate(association_views_response_fields)
        }
        for association in associations
    ]
