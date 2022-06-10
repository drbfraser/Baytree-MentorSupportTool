from typing import List, Union
import requests
import xmltodict

from .constants import (sessions_base_url, sessions_base_url_by_group,
                        views_password, views_username, volunteers_base_url)

session_views_response_fields = [
    "SessionID",
    "SessionGroupID",
    "Name",
    "StartDate",
    "StartTime",
    "Duration",
    "Cancelled",
    "Activity",
    "LeadStaff",
    "VenueID",
    "Created",
    "Updated",
    "VenueName",
]
session_translated_fields = [
    "viewsSessionId",
    "viewsSessionGroupId",
    "name",
    "startDate",
    "startTime",
    "duration",
    "cancelled",
    "activity",
    "leadStaff",
    "venueId",
    "created",
    "updated",
    "venueName",
]

def try_parse_int(string):
    try:
        return int(string)
    except:
        return string

def get_sessions(
    id: str = None,
    sessionGroupId: str = None,
    limit: int = None,
    offset: int = None,
    startDateFrom: str = None,
    startDateTo: str = None,
    personId=None,
):
    """
    Gets sessions from Views API.
    If an id argument is provided, the session with a matching id will be returned.
    The limit and offset parameters are used to implement pagination.
    The limit parameter determines how many sessions to return from the Views API.
    The offset parameter determines which session to start at when asking for
    a number of sessions from Views when using the limit parameter.
    So, if limit = 5 and offset = 5, this would say: "give me 5 sessions,
    but skip the first 5 in the total sessions returned by the Views API."
    """
    
    if id != None:
        response = requests.get(
            f"{sessions_base_url}/{id}",
            auth=(views_username, views_password),
        )

        if response.status_code != 200: return None

        parsed = xmltodict.parse(response.text)
        session = {
            session_translated_fields[i]: parsed["session"][field]
            for i, field in enumerate(session_views_response_fields)
        }
        return session
    else:
        request_url = f"{sessions_base_url}/search" if sessionGroupId is None else sessions_base_url_by_group.format(sessionGroupId)
        params = {}
        if limit != None: params["limit"] = limit
        if offset != None: params["offset"] = offset
        if startDateFrom != None: params["StartDate-from"] = startDateFrom
        if startDateTo != None: params["StartDate-to"] = startDateTo
        if personId != None: params["LeadStaff"] = personId

        response = requests.get(
            request_url,
            params=params,
            auth=(views_username, views_password),
        )

        if response.status_code != 200: return None

        parsed = xmltodict.parse(response.text)

        # Handle edge case where no sessions were returned from views
        if parsed["sessions"]["@count"] == "0":
            return {"count": parsed["sessions"]["@count"], "results": []}

        parsed_session_list = parsed["sessions"]["session"]
        if not isinstance(parsed_session_list, list):
            parsed_session_list = [parsed_session_list]

        sessions = [
            {
                session_translated_fields[i]: session[field]
                for i, field in enumerate(session_views_response_fields)
            }
            for session in parsed_session_list
        ]
        return {"count": int(parsed["sessions"]["@count"]), "results": sessions}


volunteerFields = [
    "Forename",
    "Surname",
    "PersonID",
    "Email",
    "DateOfBirth",
    "Ethnicity_V_15",
    "County",
]
volunteerTranslateFields = [
    "firstname",
    "surname",
    "viewsPersonId",
    "email",
    "dateOfBirth",
    "ethnicity",
    "country",
]

def get_volunteers(
    id: Union[List[str], str] = None,
    limit: int = None,
    offset: int = None,
    searchEmail: str = None,
    searchFirstName: str = None,
    searchLastName: str = None,
):
    """
    Gets volunteers from Views API.
    If an id argument is provided, the volunteer with a matching PersonId will be returned.
    The limit and offset parameters are used to implement pagination.
    The limit parameter determines how many vounteers to return from the Views API.
    The offset parameter determines which volunteer to start at when asking for
    The searchEmail parameter filters for volunteers by email.
    a number of volunteers from Views when using the limit parameter.
    So, if limit = 5 and offset = 5, this would say: "give me 5 volunteers,
    but skip the first 5 in the total volunteers returned by the Views API."
    """

    if searchEmail != None and searchEmail != "":
        views_request_url = volunteers_base_url + "search?Email=" + searchEmail

        if limit != None:
            views_request_url += "&pageFold=" + str(limit)

        if offset != None:
            views_request_url += "&offset=" + str(offset)

        response = requests.get(
            views_request_url, auth=(views_username, views_password)
        )

        return parse_volunteers(response)

    elif searchFirstName or searchLastName:
        if limit != None:
            views_request_url += "&pageFold=" + str(limit)

        if offset != None:
            views_request_url += "&offset=" + str(offset)

        views_request_url = "{}search?".format(volunteers_base_url)

        if searchFirstName:
            views_request_url += "&Forename={}".format(searchFirstName)

        if searchLastName:
            views_request_url += "&Surname={}".format(searchLastName)

        response = requests.get(
            views_request_url, auth=(views_username, views_password)
        )

        return parse_volunteers(response)

    elif id != None:
        ids = id
        if not isinstance(id, list):
            ids = [id]

        views_request_url = "{}search?".format(volunteers_base_url)

        for id in ids:
            views_request_url += "&PersonID[]={}".format(id)

        response = requests.get(
            views_request_url, auth=(views_username, views_password)
        )

        return parse_volunteers(response)

    else:
        if limit != None:
            if offset == None:
                offset = 0
            response = requests.get(
                volunteers_base_url
                + "search?q=&pageFold="
                + str(limit)
                + "&offset="
                + str(offset),
                auth=(views_username, views_password),
            )

        else:
            response = requests.get(
                volunteers_base_url + "search?q=", auth=(views_username, views_password)
            )

        return parse_volunteers(response)


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
