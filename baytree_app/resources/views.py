from rest_framework.decorators import api_view
from rest_framework.response import Response
# from baytree_app.FluentLoggingHandler import FluentLoggingHandler
# import os
# import traceback

base_url = 'https://thebaytreecentre.sharepoint.com/:f:/g/Ej7DxK0KjzNBuTwQ_lU-0bMBdMNHOWzHi2bzGJB86G4Bjg'
# logger = FluentLoggingHandler()


@api_view(("GET",))
def get_resource(request):
    # test_var = "testing logging methods"
    # file_path = os.path.abspath(__file__)

    # logger.debug("test_var", test_var, file_path,
    #              13, "logging test_var's value")
    # logger.req_info(base_url, request.method, None,
    #                 "Sending request for a resource")
    # logger.warning(file_path, 19, "Logging a warning")
    # try:
    #     raise ValueError("Error")
    # except ValueError as e:
    #     stack_trace = traceback.format_exc()
    #     logger.error(file_path, 22, stack_trace, "Error has occured")
    #     logger.critical(file_path, 22, stack_trace,
    #                     "Critical error has occured")

    return Response(base_url)
