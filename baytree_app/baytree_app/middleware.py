from baytree_app.FluentLoggingHandler import FluentLoggingHandler


class LoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        FluentLoggingHandler.logRequestSent(request)
        response = self.get_response(request)
        FluentLoggingHandler.logResponseReceived(response, request.path)
        return response
