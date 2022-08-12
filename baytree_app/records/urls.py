from django.urls import path

from .views import (get_session_by_id, get_sessions_by_volunteer,
                    get_sessions_stats, update_session_note)

urlpatterns = [
    path('', get_sessions_by_volunteer),
    path('stats/', get_sessions_stats),
    path('<int:id>/', get_session_by_id),
    path('<int:id>/notes/', update_session_note)
]
