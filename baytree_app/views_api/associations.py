from datetime import date, timedelta

import requests
import json
from preferences.models import Preference
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from users.models import MentorUser
from users.permissions import userIsAdmin, userIsSuperUser

from .constants import views_base_url, views_password, views_username
from .participants import get_participants
from .util import try_parse_int

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


def get_associations(volunteer_id, access_token=None):

    response = requests.get(
        staff_associations_base_url.format(volunteer_id),
        auth=(views_username, views_password),
        headers = {
            "Accept": "application/json",
            "Cookie": f"access_token={access_token}"
        }
    )

    return parse_associations(response)


def parse_associations(response):
    parsed = json.loads(response.text)

    # Check if no associations were returned from Views:
    if (
        not parsed["associations"]
        or len(parsed["associations"]) == 0
    ):
        return {
            "count": 0,
            "results": [],
        }

    # Make sure the associations are wrapped in a list, if there is a single association
    associations = parsed["associations"]
    if not isinstance(associations, list):
        associations = [associations]

    return {
        "count": len(associations),
        "results": translate_association_fields(associations),
    }


def translate_association_fields(associations):
    data = []
    for association in associations:
        dataToAdd = {}
        associationIndex = list(association.keys())[0]
        for i, field in enumerate(association_views_response_fields):
            dataToAdd[association_translated_fields[i]] = try_parse_int(association[associationIndex][field])
        data.append(dataToAdd)
    return data

# GET /api/views-api/mentor-mentees/
@api_view(("GET",))
def get_mentees_for_mentor(request):
    mentor_user = MentorUser.objects.filter(pk=request.user.id)
    if not mentor_user.exists():
        return Response(
            "The current requesting user is not a mentor!",
            status=status.HTTP_401_UNAUTHORIZED,
        )
    mentor_user = mentor_user.first()
    access_token = request.COOKIES.get('access_token')
    menteeIds = get_mentee_ids_from_mentor(mentor_user, active=True, access_token=access_token)

    participants = get_participants(menteeIds)

    return Response(participants["results"], status.HTTP_200_OK)


def get_mentee_ids_from_mentor(mentor_user, active=False, access_token=None):
    associations = get_associations(mentor_user.viewsPersonId, access_token=access_token)
    preferences = Preference.objects
    searchWindow = int(preferences.filter(key="searchingDurationInDays").first().value)
    minimumDays = int(preferences.filter(key="minimumActiveDays").first().value)
    today = date.today()
    startSearch = date(today.year, today.month, 1) - timedelta(days=searchWindow)
    endSearch = date(
        today.year + today.month // 12, today.month + 1 if today.month < 12 else 1, 1
    )

    def isActiveMentee(association):
        startActive = parse_date_string(association["startDate"])
        endActive = parse_date_string(association["endDate"])
        if endActive is None or not active:
            return True
        if startActive is None or startActive < startSearch:
            return (endActive - startSearch).days >= minimumDays
        return (min(endActive, endSearch) - startActive).days >= minimumDays

    menteeIds = []
    for association in associations["results"]:
        if association["association"] == "Mentee" and isActiveMentee(association):
            menteeIds.append(association["masterId"])
    return menteeIds


def parse_date_string(dateString: str):
    y, m, d = [int(n) for n in dateString.split("-")]
    if y == 0 or m == 0 or d == 0:
        return None
    return date(y, m, d)
