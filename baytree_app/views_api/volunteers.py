from .constants import views_base_url, views_username, views_password
import requests
import xmltodict
volunteers_base_url = views_base_url + "contacts/volunteers/"

volunteerFields = ["Forename", "Surname", "PersonID", "Email"]
volunteerTranslateFields = ["firstname", "surname", "personId", "email"]
def get_volunteers(id: str = None, limit: int = 5, offset: int = 0):
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
