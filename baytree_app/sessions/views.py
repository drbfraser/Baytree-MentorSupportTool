from rest_framework.views import APIView
from rest_framework.response import Response
from .models import MentorSession
from .serializers import SessionSerializer


# Based on https://medium.com/beyond-light-creations/build-a-rest-api-with-django-rest-framework-and-mysql-ddff0c1126ae#04e7

class SessionView(APIView):
    def get(self, request, id=None):
        if id:
            try:
                queryset = MentorSession.objects.get(id=id)
            except MentorSession.DoesNotExist:
                return Response({'errors': 'This todo item does not exist.'}, status=400)
            read_serializer = SessionSerializer(queryset)
        else:
            queryset = MentorSession.objects.all()
            read_serializer = SessionSerializer(queryset, many=True)
        return Response(read_serializer.data)

    def post(self, request):
        create_serializer = SessionSerializer(data=request.data)
        if create_serializer.is_valid():
            # If user data is valid, create a new todo item record in the database
            todo_item_object = create_serializer.save()
            # Serialize the new todo item from a Python object to JSON format
            read_serializer = SessionSerializer(todo_item_object)
            # Return a HTTP response with the newly created todo item data
            return Response(read_serializer.data, status=201)
        # If the users POST data is not valid, return a 400 response with an error message
        return Response(create_serializer.errors, status=400)
