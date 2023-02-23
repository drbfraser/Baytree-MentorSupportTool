from django.urls import path
from . import views

urlpatterns = [
    path('admin/valuelists/sessiongroup/volunteeringtypes', views.get_volunteering_types_endpoint, name='volunteer_types'),
    path('contacts/staff/<int:staffId>/associations', views.get_staff_associations, name='staff_associations'),
    path('contacts/participants/search', views.search_participants_endpoint, name='search_participants'),
]