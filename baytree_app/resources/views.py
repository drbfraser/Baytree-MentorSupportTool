from rest_framework.decorators import api_view
from rest_framework.response import Response

base_url = 'https://thebaytreecentre.sharepoint.com/:f:/g/Ej7DxK0KjzNBuTwQ_lU-0bMBdMNHOWzHi2bzGJB86G4Bjg'


@api_view(("GET",))
def get_resource(request):
    return Response(base_url)
