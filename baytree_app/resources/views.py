from rest_framework.decorators import api_view
from rest_framework.response import Response
# from baytree_app.FluentLoggingHandler import FluentLoggingHandler

base_url = 'https://thebaytreecentre.sharepoint.com/:f:/g/Ej7DxK0KjzNBuTwQ_lU-0bMBdMNHOWzHi2bzGJB86G4Bjg'
# logger = FluentLoggingHandler()


@api_view(("GET",))
def get_resource(request):
    # logger.debug("Logging debug level")
    # logger.info("Logging info level")
    # logger.warning("Logging warning level")
    # try:
    #     raise ValueError("Error")
    # except ValueError as e:
    #     logger.error("Logging error level")
    #     logger.critical("Logging critical level")

    # logger.logRequestReceived(request, "Logging request")
    # response = Response(base_url)
    # logger.logResponseSent(response, "Logging response")

    return Response(base_url)
