from rest_framework.response import Response
from rest_framework.decorators import permission_classes, api_view

@api_view(("GET",))
def get_volunteering_types_endpoint(request):
    return Response({"type": "type"}, 200)

