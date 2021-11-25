from rest_framework.response import Response
from rest_framework import status
import requests
from django.http import HttpResponse



# Create your views here.
def index(request):
    return HttpResponse('index')

def get_report(request, id=None):
    
    url = 'https://app.viewsapp.net/api/restful/evidence/questionnaires/10/questions?allquestions=1.json'
    url_head = 'https://app.viewsapp.net/api/restful/evidence/questionnaires/'
    url_tail = '/questions?allquestions=1.json'

    if request.method == 'GET':
        if id:
            url = url_head + id + url_tail
        r = requests.get(
            url,
            auth=('group.jupiter', 'Wethebest01!'))
        #print(r.content)
        return HttpResponse(r)

    elif request.method == 'POST':
        #TODO: POST to Views
        return HttpResponse('successful POST')

    else:
        return Response({"error": "Method not allowed"}, status=status.HTTP_400_BAD_REQUEST)