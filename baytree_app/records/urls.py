from django.urls import path
from .views import ViewsAppSessionView

urlpatterns = [
    path('', ViewsAppSessionView.as_view())

]
