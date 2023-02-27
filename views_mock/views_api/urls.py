from django.urls import path
from . import views

urlpatterns = [
    path('admin/valuelists/sessiongroup/volunteeringtypes', views.get_volunteering_types_endpoint, name='volunteer_types'),
    path('work/sessiongroups/<int:sessionGroupId>', views.get_session_group_by_id_endpoint, name='session_group'),
    path('work/sessiongroups/search', views.search_session_groups_endpoint, name='search_session_groups'),
    path('evidence/questionnaires/<int:questionnaireId>', views.get_questionnaire_by_id_endpoint, name='questionnaires'),
    path('evidence/questionnaires/search', views.search_questionnaires_endpoint, name='search_questionnaires'),
    path('admin/valuelists/sessiongroup/agencyactivities', views.get_activities_endpoint, name='activities'),
    path('admin/valuelists/sessiongroup/venues', views.get_venues_endpoint, name='venues'),
]