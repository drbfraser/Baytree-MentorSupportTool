from users.permissions import MentorPermissions
from users.permissions import AdminPermissions
from rest_framework.decorators import permission_classes, api_view
from contacts.models import Participant, Person, Volunteer
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

VOLUNTEER_FIELDS = [
    "Whatisyourfirstlanguage_V_19",
    "Ethnicity_V_15"
]

@api_view(("GET",))
@permission_classes([AdminPermissions | MentorPermissions])
def search_volunteers(request):
    person_ids = request.GET.getlist('PersonID[]')
    volunteer_objects = Volunteer.objects.filter(id__in=person_ids) if person_ids else Volunteer.objects.all()
    xml_element = create_xml_element(volunteer_objects, "volunteers", VOLUNTEER_FIELDS)
    return Response(data=tostring(xml_element), status=200)

@api_view(("GET",))
@permission_classes([AdminPermissions | MentorPermissions])
def search_participants(request):
    person_ids = request.GET.getlist('PersonID[]')
    participant_objects = Participant.objects.filter(id__in=person_ids) if person_ids else Participant.objects.all()
    xml_element = create_xml_element(participant_objects, "participants", PARTICIPANT_FIELDS)
    return Response(data=tostring(xml_element), status=200)

def create_xml_element(member_objects, member_type, member_fields):
    root = Element("contacts")
    participants = SubElement(root, member_type, {"count": str(len(member_objects))})

    for member_object in member_objects:
        # Append PersonID element
        participant = SubElement(participants, member_type, {"id": str(member_object.person.PersonID)})
        person_id_element = SubElement(participant, "PersonID")
        person_id_element.text = str(member_object.person.PersonID)

        # Append the remaining fields to the participant element
        person_object = Person.objects.get(PersonID=member_object.person.PersonID)
        participant = append_sub_elements(
            root=participant,
            object_fields=person_object.__dict__,
            model_fields=PERSON_FIELDS
          )
        participant = append_sub_elements(
            root=participant,
            object_fields=member_object.__dict__,
            model_fields=member_fields
          )
    return root

def append_sub_elements(root, object_fields, model_fields):
    for field in model_fields:
        field_element = SubElement(root, str(field))
        field_element.text = str(object_fields.get(field))
    return root
