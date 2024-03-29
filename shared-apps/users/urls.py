from django.urls import include, path

from baytree_app.views import GenerateCrudEndpointsForModel
from .models import AdminUser, CustomUser, MenteeUser
from .permissions import (
    AdminPermissions,
    MenteesViewPermissions,
)
from .serializers import (
    AdminSerializer,
    MenteeSerializer,
    UserSerializer,
)

from .views import (
    MentorRoleViewSet,
    StatisticViews,
    getActivitiesForMentor,
    postUser,
    resetAccountPassword,
    sendAccountCreationEmail,
    createMentorAccount,
    sendResetPasswordEmail,
    verifyCreationLink,
    verifyResetLink,
)

from rest_framework import routers

router = routers.DefaultRouter()
router.register(r"mentor-roles", MentorRoleViewSet)

urlpatterns = [
    path(
        "mentees",
        GenerateCrudEndpointsForModel.as_view(
            model=MenteeUser,
            serializer=MenteeSerializer,
            permission_classes=[MenteesViewPermissions],
        ),
    ),
    path(
        "",
        GenerateCrudEndpointsForModel.as_view(
            model=CustomUser,
            serializer=UserSerializer,
            permission_classes=[AdminPermissions],
            post_override_func=postUser,
        ),
    ),
    path("", include(router.urls)),
    path(
        "admins",
        GenerateCrudEndpointsForModel.as_view(
            model=AdminUser,
            serializer=AdminSerializer,
            permission_classes=[AdminPermissions],
        ),
    ),
    path("statistics/<type>", StatisticViews.as_view()),
    path("sendAccountCreationEmail", sendAccountCreationEmail),
    path("sendResetPasswordEmail", sendResetPasswordEmail),
    path("mentors/createAccount", createMentorAccount),
    path("resetPassword", resetAccountPassword),
    path("mentor-roles/activities", getActivitiesForMentor),
    path("verifyResetPasswordLink", verifyResetLink),
    path("verifyAccountCreationLink", verifyCreationLink)
]
