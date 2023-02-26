import os
from django.urls import resolve
import base64

class ViewsAuthMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        path = request.META["PATH_INFO"]
        access_token = request.COOKIES.get("access_token")
        headers = {"Accept": "/"}

        # For views requests, determine the appropriate authentication method depending on the destination of the request (Views App or Mock Views)
        if (path.startswith("/api/views-api")):
          if os.environ["VIEWS_BASE_URL"]=="http://views-mock:5001/":
            headers["Cookie"] = "access_token=" + access_token

          elif os.environ["VIEWS_BASE_URL"]=="https://app.viewsapp.net/api/restful/":
            auth=(os.environ["VIEWS_USERNAME"]+":" + os.environ["VIEWS_PASSWORD"]).encode("utf-8")
            base64_auth=base64.b64encode(auth).decode("utf-8")
            headers["Authorization"] = "Basic " + base64_auth

          resolved_view = resolve(request.path_info)
          response = resolved_view.func(request, headers)
          response.render()
          return response

        else:
          return self.get_response(request)
