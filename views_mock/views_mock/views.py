from rest_framework.response import Response
from rest_framework.decorators import permission_classes, api_view

from users.permissions import AdminPermissions, MentorPermissions


@api_view(("GET",))
@permission_classes([AdminPermissions | MentorPermissions])
def get_volunteering_types_endpoint(request):
  print('============Calling the mock volunteering types endpoint!==================')
  mockVolunteeringTypesResponse = {
    "results": {
      "id": 1,
      "name": "Part-time"
    }
  }
  return Response(mockVolunteeringTypesResponse, 200)

