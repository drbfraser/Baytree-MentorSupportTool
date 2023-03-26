import os
from django.urls import resolve
from django.http import HttpResponse
import base64
from baytree_app.FluentLoggingHandler import FluentLoggingHandler

class ViewsAuthMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        path = request.META["PATH_INFO"]
        headers = {"Accept": "*/*"}

        if (path.startswith("/api/views-api")):
          statusCode = addAuthToHeader(headers, request)
          if statusCode == 500:
             return HttpResponse("No request present to get access token from", 500)
          elif statusCode == 401:
             return HttpResponse("Access token is missing", 401)

          resolved_view = resolve(request.path_info)
          response = resolved_view.func(request, headers)
          response.render()
          return response

        else:
          return self.get_response(request)
        
def addAuthToHeader(headers, request):
  """For views requests, determine the appropriate authentication method depending on the
  destination of the request (Views App or Mock Views)"""

  if os.environ["VIEWS_BASE_URL"]=="http://views-mock:5001/":
    if request == None:
      FluentLoggingHandler.error("No request present to get 'Cookie' from")
      return 500
    access_token = request.COOKIES.get("access_token")
    if not access_token:
      FluentLoggingHandler.error("Cannot authorize a request to mock Views due to missing access token!")
      return 401
    headers["Cookie"] = "access_token=" + access_token
    return 200

  elif os.environ["VIEWS_BASE_URL"]=="https://app.viewsapp.net/api/restful/":
    auth=(os.environ["VIEWS_USERNAME"]+":" + os.environ["VIEWS_PASSWORD"]).encode("utf-8")
    base64_auth=base64.b64encode(auth).decode("utf-8")
    headers["Authorization"] = "Basic " + base64_auth
    return 200
