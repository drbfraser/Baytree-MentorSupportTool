from rest_framework.permissions import BasePermission, SAFE_METHODS

from users.models import AdminUser


class IsSuperUser(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_superuser


def userIsAdmin(user):
    return user and AdminUser.objects.filter(user_id=user.id)


def userIsMentorObject(user, obj):
    return obj.id == user.id


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return userIsAdmin(request.user)


class MentorsViewPermissions(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        return userIsAdmin(request.user) or userIsMentorObject(request.user, obj)
