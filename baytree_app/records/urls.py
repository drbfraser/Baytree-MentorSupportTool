from django.urls import path

from .views import (get_session_by_id, get_sessions_by_volunteer,
                    get_sessions_stats)

urlpatterns = [
    path('', get_sessions_by_volunteer),
    path('stats/', get_sessions_stats),
    path('<int:id>/', get_session_by_id)
]
