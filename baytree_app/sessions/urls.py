from django.urls import include, path
from .views import ViewsAppSessionView
from rest_framework import routers
from .views import ActivityViewSet

router = routers.DefaultRouter()
router.register(r"activities", ActivityViewSet)  # register viewset with URL config

from .views import SessionView, ViewsAppSessionView

urlpatterns = [
    path("", SessionView.as_view()),
    path("", include(router.urls)),
    path("<int:id>", SessionView.as_view()),
    path("viewsapp/", ViewsAppSessionView.as_view()),
]
