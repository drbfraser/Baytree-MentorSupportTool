from rest_framework.decorators import api_view
from rest_framework.response import Response
# from baytree_app.FluentLoggingHandler import FluentLoggingHandler

base_url = 'https://thebaytreecentre.sharepoint.com/:f:/g/Ej7DxK0KjzNBuTwQ_lU-0bMBdMNHOWzHi2bzGJB86G4Bjg'


@api_view(("GET",))
def get_resource(request):
    # FluentLoggingHandler.debug("Logging debug level")
    # FluentLoggingHandler.info("Logging info level")
    # FluentLoggingHandler.warning("Logging warning level")
    # try:
    #     raise ValueError("Error")
    # except ValueError as e:
    #     FluentLoggingHandler.error("Logging error level")
    #     FluentLoggingHandler.critical("Logging critical level")

    # FluentLoggingHandler.logRequestReceived(request, "Logging request")
    # response = Response(base_url)
    # FluentLoggingHandler.logResponseSent(
    #     response, request.path, "Logging response")

    return Response(base_url)
