# This permission class allows mentors to see their own views API info
from rest_framework.permissions import BasePermission
from users.models import MentorUser


class MentorsViewsApiPermissions(BasePermission):
    def has_permission(self, request, view):
        if request.user == None or not request.user.is_authenticated:
            return False

        mentor_user = MentorUser.objects.filter(user_id=request.user.id)
        if not mentor_user:  # No mentor user exists for this user
            return False

        mentor_user = mentor_user.first()

        if request.method == "GET":
            if "id" in request.GET:
                ids = request.GET.getlist("id", "")
                if not isinstance(ids, list):
                    ids = [ids]
                for id in ids:
                    if id != mentor_user.viewsPersonId:
                        return False  # mentor can't see other mentor information
            elif "searchEmail" in request.GET:
                searchEmails = request.GET.getlist("searchEmail", "")
                if not isinstance(searchEmails, list):
                    searchEmails = [searchEmails]
                for searchEmail in searchEmails:
                    if searchEmail != request.user.email:
                        return False  # mentor can't see other mentor information
            else:
                return False  # mentor can't see all other mentor information

        return True  # mentor can see their own information on views
