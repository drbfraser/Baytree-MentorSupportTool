from rest_framework.decorators import api_view
from rest_framework.response import Response
# from baytree_app.FluentLoggingHandler import FluentLoggingHandler

base_url = 'https://thebaytreecentre.sharepoint.com/:f:/g/Ej7DxK0KjzNBuTwQ_lU-0bMBdMNHOWzHi2bzGJB86G4Bjg'
# logger = FluentLoggingHandler()

@api_view(("GET",))
def get_resource(request):   
    # logger.logRequestReceived(request)

    # loggingMessage = {
    #     "msg": "Test log",
    #     "data": None # This can be actual data, or a string, a link, or an exception (e.__str()__)
    # }
    # logger.debug(loggingMessage)
    # logger.info(loggingMessage)
    # logger.warning(loggingMessage)
    # logger.error(loggingMessage)
    # logger.critical(loggingMessage)

    # response = Response(base_url)
    # logger.logResponseSent(response)
    return Response(base_url)


