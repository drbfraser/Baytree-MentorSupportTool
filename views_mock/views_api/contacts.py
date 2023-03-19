from users.permissions import MentorPermissions
from users.permissions import AdminPermissions
from rest_framework.decorators import permission_classes, api_view
from contacts.models import Participant, Person
from rest_framework.response import Response

from xml.etree.ElementTree import Element, SubElement, tostring

PERSON_FIELDS = [
    "Forename",
    "Surname",
    "TypeName",
    "Email",
    "DateOfBirth",
    "Countryofbirth_P_87",
]

PARTICIPANT_FIELDS = [
    "FirstLanguage_P_88",
    "Ethnicity"
]

@api_view(("GET",))
@permission_classes([AdminPermissions | MentorPermissions])
def search_participants(request):

    participant_objects = Participant.objects.all()
    root = Element("contacts")
    participants = SubElement(root, "participants", {"count": str(len(participant_objects))})

    for participant_object in participant_objects:
        # Append PersonID element
        participant = SubElement(participants, "participant", {"id": str(participant_object.person.PersonID)})
        personIDField = SubElement(participant, "PersonID")
        personIDField.text = str(participant_object.person.PersonID)

        # Append the remaining fields to the participant element
        person_object = Person.objects.get(PersonID=participant_object.person.PersonID)
        participant = append_sub_elements(
            root=participant,
            object_fields=person_object.__dict__,
            model_fields=PERSON_FIELDS
          )
        participant = append_sub_elements(
            root=participant,
            object_fields=participant_object.__dict__,
            model_fields=PARTICIPANT_FIELDS
          )
    return Response(data=tostring(root), status=200)


def append_sub_elements(root, object_fields, model_fields):
    for field in model_fields:
        xmlField = SubElement(root, str(field))
        xmlField.text = str(object_fields.get(field))
    return root

