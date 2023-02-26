from django.urls import path
from . import views

urlpatterns = [
    path('admin/valuelists/sessiongroup/volunteeringtypes', views.get_volunteering_types_endpoint, name='volunteer_types'),
    path('evidence/questionnaires/<int:questionnaireId>', views.get_questionnaire_by_id_endpoint, name='questionnaires'),
    path('evidence/questionnaires/search', views.search_questionnaires_endpoint, name='search_questionnaires'),
    path('admin/valuelists/sessiongroup/agencyactivities', views.get_activities_endpoint, name='activities'),
    path('admin/valuelists/sessiongroup/venues', views.get_venues_endpoint, name='venues'),
]