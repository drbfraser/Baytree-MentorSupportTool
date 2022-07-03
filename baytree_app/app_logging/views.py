import logging

from rest_framework import status
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.permissions import AllowAny

# POST api/logging
class LoggingViews(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def post(self, request):

        # Validate data existence
        data = request.data
        if data["level"] is None or data["message"] is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        # Get a logger
        logger = logging.getLogger("django")

        # Log message
        try:
            # Create log message
            logMessage = '[{0}] {1}: {2} \n {3}'
            logMessage.format(data["timeStamp"], data["level"], data["message"], data["stackTrace"])
            logLevel = data["level"]
            if logLevel == "debug":
                logger.debug(logMessage)
            elif logLevel == "info":
                logger.info(logMessage)
            elif logLevel == "warning":
                logger.warning(logMessage)
            elif logLevel == "critical":
                logger.critical(logMessage)
            else:
                logger.error(logMessage)

            return Response(status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
