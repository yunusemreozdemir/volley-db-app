from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login, name='login'),
    path('create-user/', views.create_user, name='create-user'),
    path('get-players/', views.get_players, name='get-players'),
    path('update-stadium/', views.update_stadium, name='update-stadium'),
    path('get-stadiums/', views.get_stadiums, name='get-stadiums'),
    path('delete-match-session/', views.delete_match_session, name='delete-match-session'),
    path('add-match-session/', views.add_match_session, name='add-match-session'),
]