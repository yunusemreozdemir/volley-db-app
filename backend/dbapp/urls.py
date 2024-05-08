from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login, name='login'),
    path('create-user/', views.create_user, name='create-user'),
    path('get-players/', views.get_players, name='get-players'),
    path('update-stadium/', views.update_stadium, name='update-stadium'),
    path('get-stadiums/', views.get_stadiums, name='get-stadiums'),
    path('add-match-session/', views.add_match_session, name='add-match-session'),
    path('view-rating-stats/', views.view_rating_stats, name='view-rating-stats'),
    path('rate-match-session/', views.rate_match_session, name='rate-match-session'),
    path('view-players/', views.view_players, name='view-players'),
]