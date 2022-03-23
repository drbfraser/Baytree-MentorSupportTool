from rest_framework.permissions import BasePermission

class IsSuperUser(BasePermission):

    def has_permission(self, request, view):
        return request.user and request.user.is_superuser

# Allow only the mentor making the request to deal with their own notifications
# If creating a notification with POST, return False since only admins can do that
# If DELETE request, return True and check object permissions within the delete view function instead
class IsRequestingMentor(BasePermission):
    def has_permission(self, request, view):
        return request.method == 'PATCH' or \
            request.method == 'DELETE' or \
            (request.method == 'GET' and str(request.user.id) == request.query_params['mentor_id'])
