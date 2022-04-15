from django.urls import path

from .views import SessionView, ViewsAppSessionView

urlpatterns = [
    path("", SessionView.as_view()),
    path("<int:id>", SessionView.as_view()),
    path("viewsapp/", ViewsAppSessionView.as_view()),
]
