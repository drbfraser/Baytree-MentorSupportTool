from django.urls import include, path

urlpatterns = [
    path('', include('views_api.urls'))
]
