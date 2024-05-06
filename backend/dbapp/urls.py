from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login, name='login'),
    path('create-user/', views.create_user, name='create-user'),
    path('get-players/', views.get_players, name='get-players'),
]