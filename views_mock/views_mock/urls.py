from django.urls import include, path

urlpatterns = [
    path('', include('volunteering_types.urls'))
]
