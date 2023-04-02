from django.urls import path
from . import views
from .contacts import search_participants
from .valuelists import get_volunteering_types_endpoint, get_activities_endpoint, get_venues_endpoint, get_valuelists_endpoint

urlpatterns = [
    path('admin/valuelists/sessiongroup/volunteeringtypes', get_volunteering_types_endpoint, name='volunteer_types'),
    path('admin/valuelists/sessiongroup/agencyactivities', get_activities_endpoint, name='activities'),
    path('admin/valuelists/sessiongroup/venues', get_venues_endpoint, name='venues'),
    path('admin/valuelists/sessiongroup/<int:valueListID>', get_valuelists_endpoint, name='valuelists'),

    path('contacts/staff/<int:staffId>/associations', views.get_staff_associations, name='staff_associations'),
    path('contacts/participants/search', search_participants, name='search_participants'),

    path('work/sessiongroups/<int:sessionGroupId>', views.get_session_group_by_id_endpoint, name='session_group'),
    path('work/sessiongroups/search', views.search_session_groups_endpoint, name='search_session_groups'),
    
    path('evidence/questionnaires/<int:questionnaireId>', views.get_questionnaire_by_id_endpoint, name='questionnaires'),
    path('evidence/questionnaires/search', views.search_questionnaires_endpoint, name='search_questionnaires')
]