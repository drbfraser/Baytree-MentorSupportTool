from django.urls import path
from . import views
from .questionnaires import get_questionnaire_by_id, search_questionnaires
from .contacts import search_participants, search_volunteers
from .valuelists import get_valuelists_by_type_and_name, get_valuelists_by_id

urlpatterns = [
    path('admin/valuelists/<str:typeOfValueList>/<str:name>', get_valuelists_by_type_and_name, name='valuelists_type_name'),
    path('admin/valuelists/<int:valueListID>', get_valuelists_by_id, name='valuelists_id'),

    path('contacts/staff/<int:staffId>/associations', views.get_staff_associations, name='staff_associations'),
    path('contacts/participants/search', search_participants, name='search_participants'),
    path('contacts/volunteers/search', search_volunteers, name='search_volunteers'),


    path('work/sessiongroups/<int:sessionGroupId>', views.get_session_group_by_id_endpoint, name='session_group'),
    path('work/sessiongroups/search', views.search_session_groups_endpoint, name='search_session_groups'),
    
    path('evidence/questionnaires/<int:questionnaireId>', get_questionnaire_by_id, name='questionnaires'),
    path('evidence/questionnaires/search', search_questionnaires, name='search_questionnaires'),
]