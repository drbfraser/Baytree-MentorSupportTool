from django.urls import path
from .views import QuestionnaireView
from . import views


urlpatterns = [
    path('', QuestionnaireView.as_view()),
    path('<int:id>', QuestionnaireView.as_view()),
    path('get-report/', views.get_report),
    path('get-report/<str:id>', views.get_report)
]