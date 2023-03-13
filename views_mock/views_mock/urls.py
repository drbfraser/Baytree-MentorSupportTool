from django.urls import include, path

urlpatterns = [
    path('', include('volunteering_types.urls')),
    path('api/restful/work/sessiongroups/', include('views_sessions.urls'))
]
