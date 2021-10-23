from rest_framework.response import Response
from rest_framework import status
import requests
from django.http import HttpResponse

url = 'https://app.viewsapp.net/api/restful/evidence/questionnaires/10/questions?allquestions=1.json'
headers = {'Accept:application/json'}

# Create your views here.
def index(request):
    return HttpResponse('index')


def report(request):
    if request.method == 'POST':
        return Response({"error": "Method not allowed"}, status=status.HTTP_400_BAD_REQUEST)
    else:
        r = requests.get(
            url,
            auth=('group.jupiter', 'Wethebest01!'))
        print(r.content)
        return HttpResponse(r)