from users.permissions import MentorPermissions
from users.permissions import AdminPermissions
from rest_framework.decorators import permission_classes, api_view, renderer_classes
from contacts.models import Participant, Person, Volunteer
from rest_framework.response import Response
from rest_framework_xml.renderers import XMLRenderer
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
@renderer_classes([XMLRenderer])
def search_volunteers(request):
    person_ids = request.GET.getlist("PersonID[]")
    volunteer_objects = Volunteer.objects.filter(id__in=person_ids) if person_ids else Volunteer.objects.all()
    xml_element = create_xml_element(volunteer_objects, "volunteers", VOLUNTEER_FIELDS)
    return Response(data=tostring(xml_element), status=200)

@api_view(("GET",))
@permission_classes([AdminPermissions | MentorPermissions])
@renderer_classes([XMLRenderer])
def search_participants(request):
    person_ids = request.GET.getlist("PersonID[]")
    participant_objects = Participant.objects.filter(id__in=person_ids) if person_ids else Participant.objects.all()
    xml_element = create_xml_element(participant_objects, "participant", PARTICIPANT_FIELDS)

    return Response(data=tostring(xml_element, encoding="utf8", method="xml"), status=200)


def create_xml_element(user_objects, user_type, user_fields):
    """
      Creates an XML element with the following hierarchy (Participant example):
        <contacts>
          <participants>
            <participant>
            </participant>
          <participants/>
        </contacts
    """
    root = Element("contacts")
    users = SubElement(root, user_type + "s", {"count": str(len(user_objects))})

    for user_object in user_objects:
        # Append PersonID element
        user = SubElement(users, user_type, {"id": str(user_object.person.PersonID)})
        person_id_element = SubElement(user, "PersonID")
        person_id_element.text = str(user_object.person.PersonID)

        # Append the remaining fields to the participant element
        person_object = Person.objects.get(PersonID=user_object.person.PersonID)
        user = append_sub_elements(
            root=user,
            object_fields=person_object.__dict__,
            model_fields=PERSON_FIELDS
          )
        user = append_sub_elements(
            root=user,
            object_fields=user_object.__dict__,
            model_fields=user_fields
          )
    return root

def append_sub_elements(root, object_fields, model_fields):
    for field in model_fields:
        field_element = SubElement(root, str(field))
        field_element.text = str(object_fields.get(field))
    return root
