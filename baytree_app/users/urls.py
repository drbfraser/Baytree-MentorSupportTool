from django.urls import path

from baytree_app.views import GenerateCrudEndpointsForModel
from .models import AdminUser, CustomUser, MenteeUser, MentorUser
from .permissions import AdminPermissions, MenteesViewPermissions, MentorsViewPermissions
from .serializers import AdminSerializer, MenteeSerializer, MentorSerializer, UserSerializer

from .views import AdminsView, StatisticViews, get_mentors_from_views, postUser

urlpatterns = [
    path('mentees', GenerateCrudEndpointsForModel.as_view(model=MenteeUser,
                                                          serializer=MenteeSerializer, permission_classes=[MenteesViewPermissions])),
    path('mentors', GenerateCrudEndpointsForModel.as_view(model=MentorUser,
                                                          serializer=MentorSerializer, permission_classes=[MentorsViewPermissions])),
    path('', GenerateCrudEndpointsForModel.as_view(model=CustomUser,
                                                   serializer=UserSerializer,
                                                   permission_classes=[
                                                       AdminPermissions],
                                                   post_override_func=postUser)),
    path('mentors/from-views', get_mentors_from_views),
    path('mentors/from-views/<str:id>', get_mentors_from_views),
    path('admins', GenerateCrudEndpointsForModel.as_view(model=AdminUser,
                                                          serializer=AdminSerializer, permission_classes=[AdminPermissions])),
    path('statistics/<type>', StatisticViews.as_view())
]
