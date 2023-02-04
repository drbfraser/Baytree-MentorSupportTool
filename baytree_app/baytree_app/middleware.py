from baytree_app.FluentLoggingHandler import FluentLoggingHandler

class LoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.fluentLogger = FluentLoggingHandler()

    def __call__(self, request):
        self.fluentLogger.logRequestReceived(request)
        response = self.get_response(request)
        self.fluentLogger.logResponseSent(response)
        return response
