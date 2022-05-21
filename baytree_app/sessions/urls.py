from django.urls import include, path
from .views import ViewsAppSessionView
from rest_framework import routers
from .views import ActivityViewSet

router = routers.DefaultRouter()
router.register(r"activities", ActivityViewSet)  # register viewset with URL config

urlpatterns = [
    path("", include(router.urls)),
    path("viewsapp/", ViewsAppSessionView.as_view()),
]
