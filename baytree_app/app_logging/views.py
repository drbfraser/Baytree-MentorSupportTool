import logging
from urllib.request import Request
from django.http import HttpResponse

import requests
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

# Create your views here.
# POST /api/logging/
@api_view(("POST", ))
def submit_log(request):
    """
    Submit the log to logging file
    """
    # Validate data existence
    data = request.data
    if data["logType"] is None or data["logMessage"] is None:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
    # Get a logger
    logger = logging.getLogger(__name__)

    # log message
    logType = data["logType"]
    logMessage = data["logMessage"]
    if logType == "debug":
        logger.debug(logMessage)
    elif logType == "info":
        logger.info(logMessage)
    elif logType == "warning":
        logger.warning(logMessage)
    elif logType == "critical":
        logger.critical(logMessage)
    else:
        logger.error(logMessage)

    return Response(status=status.HTTP_200_OK)