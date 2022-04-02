from django.urls import path
from sessions.serializers import MonthlyExpectedSessionCountsSerializer
from sessions.models import MonthlyExpectedSessionCounts
from sessions.permissions import AdminPermissions

from baytree_app.views import GenerateCrudEndpointsForModel
from .views import SessionView, ViewsAppSessionView

urlpatterns = [
    path("", SessionView.as_view()),
    path("<int:id>", SessionView.as_view()),
    path("viewsapp/", ViewsAppSessionView.as_view()),
    path(
        "monthly-expected-session-counts",
        GenerateCrudEndpointsForModel.as_view(
            model=MonthlyExpectedSessionCounts,
            permission_classes=[AdminPermissions],
            serializer=MonthlyExpectedSessionCountsSerializer,
        ),
    ),
]
