import os
from django.urls import resolve
from django.http import HttpResponse
import base64
from baytree_app.FluentLoggingHandler import FluentLoggingHandler
from django.utils.decorators import sync_and_async_middleware
import asyncio

@sync_and_async_middleware
class ViewsAuthMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

        if asyncio.iscoroutinefunction(get_response):
           async def middleware(request):
              response = await get_response(request)
              return response
        else:
           def middleware(request):
              response = get_response(request)
              return response
        self.middleware = middleware

    def process_view(self, request, view, *args, **kwargs):
      if asyncio.iscoroutinefunction(view):
         loop = asyncio.new_event_loop()
         asyncio.set_event_loop(loop)
         response = loop.run_until_complete(view(request))
         return response

      return view(request)

    def __call__(self, request):
        path = request.META["PATH_INFO"]
        authorization_handlers = {
           "http://views-mock:5001/": authorize_mock_views,
           "https://app.viewsapp.net/api/restful/": authorize_views_app
        }

        if (path.startswith("/api/views-api")):
          authorization_handlers[os.environ["VIEWS_BASE_URL"]](request)
          response = self.middleware(request)

          return response

        else:
          return self.get_response(request)

def authorize_mock_views(request):
  access_token = request.COOKIES.get("access_token")
  if (access_token):
    request.META["VIEWS_AUTHORIZATION"] = "access_token=" + access_token
  else:
    FluentLoggingHandler.error("Cannot authorize a request to mock Views due to missing access token!")
    return HttpResponse('Access token is missing', status=401)

def authorize_views_app(request):
  auth=(os.environ["VIEWS_USERNAME"]+":" + os.environ["VIEWS_PASSWORD"]).encode("utf-8")
  base64_auth=base64.b64encode(auth).decode("utf-8")
  request.META['VIEWS_AUTHORIZATION'] = "Basic " + base64_auth


