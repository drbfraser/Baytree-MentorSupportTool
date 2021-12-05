from django.urls import path
from .views import QuestionAndAnswerView

urlpatterns = [
    path('', QuestionAndAnswerView.as_view()),
    path('<int:id>', QuestionAndAnswerView.as_view())
]