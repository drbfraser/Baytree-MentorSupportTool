from django.urls import include, path
from .views import VenueViewSet

from rest_framework import routers

router = routers.DefaultRouter()
router.register(r"venues", VenueViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
