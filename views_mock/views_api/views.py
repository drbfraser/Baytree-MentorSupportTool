from rest_framework.decorators import permission_classes, api_view
from rest_framework.response import Response

from users.permissions import AdminPermissions, MentorPermissions

@api_view(("GET",))
@permission_classes([AdminPermissions | MentorPermissions])
def get_volunteering_types_endpoint(request):

  data = {
        "items": {
          "volunteer_types": [
              {"id": 1, "type_name": "Community Service"},
              {"id": 2, "type_name": "Environmental Work"},
              {"id": 3, "type_name": "Animal Care"},
          ]
        }
    }
  return Response(data, 200)

@api_view(("GET",))
def get_staff_associations(request, staffId):
  # Note that if the staff has a single association, the object is not wrapped in a list
  # Otherwise, associations is a list
  data = {
    "associations": {
      "3": {
        "AssociationID": "3",
        "MasterType": "Person",
        "MasterID": "5",
        "SlaveType": "Staff",
        "SlaveID": str(staffId),
        "Association": "Mentee",
        "Description": "",
        "StartDate": "2021-06-15",
        "EndDate": "0000-00-00",
        "Created": "2021-09-24 12:47:06",
        "CreatedBy": "group.customer",
        "Updated": "2021-11-05 01:07:27",
        "UpdatedBy": "group.earth"
      }
    }
  }
  return Response(data, 200)