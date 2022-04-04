from django.urls import path
from .views import ViewsAppSessionView

urlpatterns = [
    path('viewsapp/', ViewsAppSessionView.as_view())
]