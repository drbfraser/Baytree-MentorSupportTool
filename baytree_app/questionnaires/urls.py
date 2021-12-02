from django.urls import path
from .views import QuestionnaireView

urlpatterns = [
    path('', QuestionnaireView.as_view()),
    path('<int:id>', QuestionnaireView.as_view()),
]