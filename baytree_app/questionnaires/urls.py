from django.urls import path
from .views import get_questionnaire, submit_answer_set

# /api/questionnaires/
urlpatterns = [
    path('questionnaire/', get_questionnaire),
    path('questionnaire/submitAnswer/', submit_answer_set)
]