from users.permissions import MentorPermissions
from users.permissions import AdminPermissions
from rest_framework.decorators import permission_classes, api_view
from contacts.models import Participant
from rest_framework.response import Response

from xml.etree.ElementTree import Element, SubElement, tostring


participantFields = [
    "Forename",
    "Surname",
    "Email",
    "DateOfBirth",
    "Ethnicity",
    "Country",
    "FirstLanguage_P_88"
]

@api_view(("GET",))
@permission_classes([AdminPermissions | MentorPermissions])
def search_participants_endpoint(request):
    participantObjects = Participant.objects.all()
    root = Element("contacts")
    participants = SubElement(root, "participants", {"count": str(len(participantObjects))})

    for participantObject in participantObjects:
        participant = SubElement(participants, "participant", {"id": str(participantObject.person.PersonID)})
        personIDField = SubElement(participant, "PersonID")
        personIDField.text = str(participantObject.person.PersonID)
        for field in participantFields:
            xmlField = SubElement(participant, str(field))
            xmlField.text = str(participantObject.__dict__.get(field))
    return Response(data=tostring(root), status=200)
