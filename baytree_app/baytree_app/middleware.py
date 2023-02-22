from baytree_app.FluentLoggingHandler import FluentLoggingHandler
import os
from django.urls import resolve

class LoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        FluentLoggingHandler.logRequestReceived(request)
        response = self.get_response(request)
        FluentLoggingHandler.logResponseSent(response)
        return response

class AccessTokenMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        path = request.META['PATH_INFO']
        access_token = request.COOKIES.get('access_token')
        if (path.startswith('/api/views-api') and os.environ['VIEWS_BASE_URL']=='http://views-mock:5001/'):
          if (access_token):
            resolved_view = resolve(request.path_info)
            response = resolved_view.func(request, access_token)
            response.render()
            return response
