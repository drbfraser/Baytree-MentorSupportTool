from rest_framework.permissions import BasePermission

class IsSuperUser(BasePermission):

    def has_permission(self, request, view):
        return request.user and request.user.is_superuser


class IsOwner(BasePermission):

    def has_object_permission(self, request, view, obj):

        return obj.id == request.user.id 