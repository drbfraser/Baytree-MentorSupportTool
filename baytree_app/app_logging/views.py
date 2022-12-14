import logging
import datetime
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
        logger = logging.getLogger("django_error_log")

        # Log message
        try:
            # Create log message
            date_time = datetime.datetime.fromtimestamp(data["timeStamp"] / 1000)
            log_level = data["level"].upper()
            stack_trace = data["stackTrace"]
            if stack_trace != "":
                stack_trace = "\n" + stack_trace

            log_message = '[{timeStamp}] {logLevel}: {message} {stackTrace}'
            formatted_log_message = log_message.format(timeStamp = date_time, logLevel = log_level,
                message = data["message"], stackTrace = stack_trace)

            log_level = data["level"]
            if log_level == "debug":
                logger.debug(formatted_log_message)
            elif log_level == "info":
                logger.info(formatted_log_message)
            elif log_level == "warning":
                logger.warning(formatted_log_message)
            elif log_level == "critical":
                logger.critical(formatted_log_message)
            else:
                logger.error(formatted_log_message)

            return Response(status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
