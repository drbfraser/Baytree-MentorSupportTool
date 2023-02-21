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
@permission_classes([AdminPermissions | MentorPermissions])
def get_venues_endpoint(request):

  items = {
    "item id=\"0\"": "Venue 1",
    "item id=\"1\"": "Venue 2",
    "item id=\"2\"": "Venue 3"
  }
  data = {
    "count": 3,
    "items": items,
    "archivedItems": 0
  }
  return Response(data, 200)