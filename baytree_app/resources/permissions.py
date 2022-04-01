from rest_framework.permissions import BasePermission, SAFE_METHODS
from users.models import MenteeUser, MentorUser
from users.models import AdminUser

class SuperUserPermissions(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_superuser

def userIsAdmin(user):
    return user and AdminUser.objects.filter(user_id=user.id)

def requestUserIsUserObject(user, obj):
    return obj.id == user.id

def userIsSuperUser(user):
    return user and user.is_superuser

def user_is_mentor_of(user, mentee_user_id):
    mentorUser = MentorUser.objects.get(pk=user.id)
    menteeUser = MenteeUser.objects.get(pk=mentee_user_id)
    return menteeUser in mentorUser.menteeUsers.all()

class AdminPermissions(BasePermission):
    def has_permission(self, request, view):
        return userIsAdmin(request.user) or userIsSuperUser(request.user)

class IsUserAMentor(BasePermission):
    def has_permission(self, request, view):
        return MentorUser.objects.filter(pk=request.user.id).exists()

class MentorsViewPermissions(BasePermission):
    def has_permission(self, request, view):
        if request.user == None or not request.user.is_authenticated:
            return False

        if userIsSuperUser(request.user) or userIsAdmin(request.user):
            return True # admins or super users have full permissions for mentor endpoints

        if request.method == 'GET':
            if 'id' in request.GET:
                ids = request.GET.getlist('id', '')
                if not isinstance(ids, list):
                    ids = [ids]
                for id in ids:
                    if id != str(request.user.id):
                        return False # mentor can't see other mentor information
            else:
                return False # mentor can't see other mentor information

        return True # mentor can see their own information

class MenteesViewPermissions(BasePermission):
    def has_permission(self, request, view):
        if request.user == None or not request.user.is_authenticated:
            return False

        if userIsSuperUser(request.user) or userIsAdmin(request.user):
            return True # admins or super users have full permissions for mentee endpoints

        if request.method == 'GET':
            if 'id' in request.GET:
                ids = request.GET.getlist('id', '')
                if not isinstance(ids, list):
                    ids = [ids]
                for id in ids:
                    if user_is_mentor_of(request.user, id): # mentors can see their mentee info
                        continue
                    if id != str(request.user.id):
                        return False # mentees can't see other mentees information, and non-related mentors
            else:
                return False # mentees can't see other mentees information, and non-related mentors

        return True # mentees can see their own info, as well as their mentors