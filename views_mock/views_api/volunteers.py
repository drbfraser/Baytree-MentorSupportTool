from users.permissions import MentorPermissions
from users.permissions import AdminPermissions
from rest_framework.decorators import permission_classes, api_view
from contacts.models import Person, Volunteer
from rest_framework.response import Response
from django.db.models import Q

@api_view(("GET",))
@permission_classes([AdminPermissions | MentorPermissions])
def search_volunteers(request):
    person_ids = request.GET.getlist('PersonID[]') or []
    forename = request.GET.get('Forename')
    surname = request.GET.get('Surname')
    email = request.GET.get('Email')
    print('surname from the query:', surname)
    print('person_ids:', person_ids)
    person_filter = Q(PersonID__in=person_ids)

    if forename is not None:
        person_filter &= Q(Forename=forename)

    if surname is not None:
        person_filter &= Q(Surname=surname)

    if email is not None:
        person_filter &= Q(Email=email)
    print(person_filter)

    person_objects = Person.objects.filter(person_filter)
    print('person objects:', person_objects)
    for person in person_objects:
        print('person object data:', person.__dict__)

    volunteer_objects = Volunteer.objects.filter(
        person__in=Person.objects.filter(person_filter))
    print('volunteer objecs:', volunteer_objects)

    for volunteer in volunteer_objects:
        print(volunteer.person.Surname)

    # xml_element = create_xml_element(volunteer_objects)
    # return Response(data=tostring(xml_element), status=200)

