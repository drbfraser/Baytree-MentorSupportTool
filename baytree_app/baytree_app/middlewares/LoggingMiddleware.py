from baytree_app.FluentLoggingHandler import FluentLoggingHandler


class LoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        FluentLoggingHandler.logRequest(request)
        response = self.get_response(request)
        FluentLoggingHandler.logResponse(response, request)
        return response
