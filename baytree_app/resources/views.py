from rest_framework.decorators import api_view
from rest_framework.response import Response
# from baytree_app.FluentLoggingHandler import FluentLoggingHandler

base_url = 'https://thebaytreecentre.sharepoint.com/:f:/g/Ej7DxK0KjzNBuTwQ_lU-0bMBdMNHOWzHi2bzGJB86G4Bjg'
# logger = FluentLoggingHandler()

@api_view(("GET",))
def get_resource(request):   
    # logger.writeRequestReceivedLog(request)
    # logger.writeMessageLog("Test log", logger.INFO)
    # response = Response(base_url)
    # logger.writeResponseSentLog(response)
    return Response(base_url)


