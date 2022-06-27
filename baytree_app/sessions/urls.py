from django.urls import include, path
from .views import SessionView, VenueViewSet, ViewsAppSessionView

from rest_framework import routers

router = routers.DefaultRouter()
router.register(r"venues", VenueViewSet)

urlpatterns = [
    path("", SessionView.as_view()),
    path("<int:id>", SessionView.as_view()),
    path("viewsapp/", ViewsAppSessionView.as_view()),
    path("", include(router.urls)),
]
