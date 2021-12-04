from django.urls import path
from .views import QuestionnaireView


urlpatterns = [
    path('', QuestionnaireView.as_view()),
    path('<int:id>', QuestionnaireView.as_view()),
    path('get_questionnaire/', QuestionnaireView.get_questionnaire),
    path('get_questionnaire/<str:id>', QuestionnaireView.get_questionnaire)
]