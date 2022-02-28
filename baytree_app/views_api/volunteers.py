from .constants import views_base_url, views_username, views_password
import requests
import xmltodict
volunteers_base_url = views_base_url + "contacts/volunteers/"

volunteerFields = ["Forename", "Surname", "PersonID", "Email"]
volunteerTranslateFields = ["firstname", "surname", "personId", "email"]


def get_volunteers(id: str = None, limit: int = 5, offset: int = 0):
    """
    Gets volunteers from Views API.
    If an id argument is provided, the volunteer with a matching PersonId will be returned.
    The limit and offset parameters are used to implement pagination.
    The limit parameter determines how many vounteers to return from the Views API.
    The offset parameter determines which volunteer to start at when asking for
    a number of volunteers from Views when using the limit parameter.
    So, if limit = 5 and offset = 5, this would say: "give me 5 volunteers,
    but skip the first 5 in the total volunteers returned by the Views API."
    """

    if id != None:
        response = requests.get(
            volunteers_base_url + id,
            auth=(views_username, views_password))
        parsed = xmltodict.parse(response.text)
        volunteer = {volunteerTranslateFields[i]: parsed["volunteer"][field]
                     for i, field in enumerate(volunteerFields)}
        return volunteer
    else:
        response = requests.get(
            volunteers_base_url + "search?q=&pageFold=" +
            str(limit) + "&offset=" + str(offset),
            auth=(views_username, views_password))
        parsed = xmltodict.parse(response.text)
        volunteers = [{volunteerTranslateFields[i]: volunteer[field] for i, field in enumerate(volunteerFields)}
                      for volunteer in parsed["contacts"]["volunteers"]["volunteer"]]
        return {"total": parsed["contacts"]["volunteers"]["@count"], "data": volunteers}