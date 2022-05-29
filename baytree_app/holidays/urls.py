from django.urls import path

from . import views

# /api/holidays/
urlpatterns = [
  path('', views.holiday_list_view),
  path('create/', views.holiday_create_view),
  path('<int:pk>/update/', views.holiday_update_view),
  path('<int:pk>/delete/', views.holiday_destroy_view)
]