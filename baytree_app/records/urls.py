from django.urls import path
from .views import ViewsAppSessionView

urlpatterns = [
    path('<int:id>', ViewsAppSessionView.as_view())

]
