from django.shortcuts import redirect

class ViewsAPIMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
    def __call__(self, request):
        if (request.path == '/api/views-api/volunteers/volunteer/'):
          response = redirect('http://localhost:5000/api/volunteers/volunteer/')
          return response
        response =self.get_response(request)
        return response
