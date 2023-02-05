from rest_framework.decorators import permission_classes, api_view
from rest_framework.response import Response

@api_view(("GET",))
# @permission_classes([AdminPermissions | MentorPermissions])
def get_volunteering_types_endpoint(request):
  print('============Calling the mock volunteering types endpoint!==================')
  auth = request.GET.get('auth')
  print("AUTH??:", auth)
  data = {
        "volunteer_types": [
            {"id": 1, "type_name": "Community Service"},
            {"id": 2, "type_name": "Environmental Work"},
            {"id": 3, "type_name": "Animal Care"},
        ]
    }
  return Response(data, 200)