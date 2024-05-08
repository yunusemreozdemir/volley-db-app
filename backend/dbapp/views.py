from django.shortcuts import render, get_object_or_404
from django.db import connection
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework import status
from datetime import datetime

from .serializers import UserSerializer

@api_view(['GET'])
def get_positions(request):
    cursor = connection.cursor()
    cursor.execute("SELECT position_id, position_name FROM Position")
    positions = cursor.fetchall()
    return Response({'positions': positions})


@api_view(['GET'])
def get_teams(request):
    cursor = connection.cursor()
    cursor.execute("SELECT team_id, team_name FROM Team")
    teams = cursor.fetchall()
    return Response({'teams': teams})


@api_view(['GET'])
def get_stadiums(request):
    cursor = connection.cursor()
    cursor.execute("SELECT DISTINCT stadium_id, stadium_name, stadium_country FROM MatchSession")
    stadiums = cursor.fetchall()
    return Response({'stadiums': stadiums})


@api_view(['POST'])
def create_user(request):
    data = request.data
    usertype = data['usertype']        
    username = data['username']
    password = data['password']
    name = data['name']
    surname = data['surname']
    cursor = connection.cursor()
    for user_type in ['DBManager', 'Player', 'Coach', 'Jury']:
        user = cursor.execute("SELECT * FROM " + user_type + " WHERE username = %s", [username])
        if user:
            return Response({'error': 'Username already exists'}, status=status.HTTP_409_CONFLICT)

    if usertype == "Player":
        date_of_birth = data['date_of_birth']
        date_of_birth = datetime.strptime(date_of_birth[:10], '%Y-%m-%d').strftime('%d/%m/%Y')
        height = data['height']
        weight = data['weight']
        team_ids = data['team_ids']
        position_ids = data['position_ids']
        cursor.execute("INSERT INTO Player (username, password, name, surname, date_of_birth, height, weight) VALUES (%s, %s, %s, %s, %s, %s, %s)", [username, password, name, surname, date_of_birth, height, weight])
        for team_id in set(team_ids):
            cursor.execute("SELECT MAX(player_teams_id) FROM PlayerTeams")
            player_teams_id = cursor.fetchone()[0] + 1
            cursor.execute(f'INSERT INTO PlayerTeams (player_teams_id, username, team_ID) VALUES ({player_teams_id}, "{username}", {team_id})')
        for position_id in set(position_ids):
            cursor.execute("SELECT MAX(player_positions_id) FROM PlayerPositions")
            player_positions_id = cursor.fetchone()[0] + 1
            cursor.execute(f'INSERT INTO PlayerPositions (player_positions_id, username, position_ID) VALUES ({player_positions_id}, "{username}", {position_id})')

    elif usertype == "Coach":
        nationality = data['nationality']
        cursor.execute("INSERT INTO Coach (username, password, name, surname,  nationality) VALUES (%s, %s, %s, %s, %s)", [username, password, name, surname, nationality])
        
    elif usertype == "Jury":
        nationality = data['nationality']
        cursor.execute("INSERT INTO Jury (username, password, nationality) VALUES (%s, %s, %s, %s, %s)", [username, password, name, surname,  nationality])
    else:
        return Response({'error': 'Invalid user type'}, status=status.HTTP_400_BAD_REQUEST)
    
    return Response(request.data, status=status.HTTP_200_OK)


@api_view(['POST'])
def login(request):
    cursor = connection.cursor()
    types = ['DBManager', 'Player', 'Coach', 'Jury']
    for user_type in types:
        user = cursor.execute("SELECT * FROM " + user_type + " WHERE username = %s AND password = %s", [request.data['username'], request.data['password']])
        if user:
            break
    if not user:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    user = cursor.fetchone()
    return Response({'user': user[0], "type": user_type})

@api_view(['POST'])
def update_stadium(request):
    data = request.data
    previous_name = data['previous_name']
    name = data['name']
    cursor = connection.cursor()
    cursor.execute("UPDATE MatchSession SET stadium_name = %s WHERE stadium_name = %s", [name, previous_name])
    print(cursor.rowcount)
    return Response("Stadium not found" if cursor.rowcount == 0 else f"{cursor.rowcount} stadium names changed.", status=status.HTTP_200_OK)
    
@api_view(['GET'])
def get_stadiums(request):
    cursor = connection.cursor()
    cursor.execute("SELECT DISTINCT stadium_name, stadium_country, stadium_ID FROM MatchSession")
    stadiums = cursor.fetchall()
    return Response({'stadiums': stadiums})

# TODO this function expects a date in the format 'dd.mm.yyyy', currently it uses current date.
@api_view(['POST'])
def add_match_session(request):
    data = request.data
    coach_username = data['coach_username']
    stadium_id = data['stadium_id']
    date = data['date']
    time_slot = data['time_slot']
    assigned_jury_username = data['assigned_jury_username']
    cursor = connection.cursor()
    cursor.execute("SELECT MAX(session_ID) FROM MatchSession")
    session_id = cursor.fetchone()[0] + 1
    current_date = datetime.now().strftime('%d.%m.%Y')
    print(current_date)
    cursor.execute(f'SELECT team_ID FROM Team WHERE coach_username = "{coach_username}" AND STR_TO_DATE(contract_start, "%d.%m.%Y") <= STR_TO_DATE("{current_date}", "%d.%m.%Y") AND STR_TO_DATE(contract_finish, "%d.%m.%Y") > STR_TO_DATE("{current_date}", "%d.%m.%Y")')
    team_id = cursor.fetchone()[0]
    cursor.execute(f"SELECT DISTINCT stadium_name, stadium_country FROM MatchSession WHERE stadium_ID = {stadium_id}")
    stadium_name, stadium_country = cursor.fetchone()
    cursor.execute(f'SELECT COUNT(*) FROM Jury WHERE username = "{assigned_jury_username}"')
    if cursor.fetchone()[0] == 0:
        return Response("Jury not found", status=status.HTTP_404_NOT_FOUND)
    cursor.execute(f'INSERT INTO MatchSession (session_ID, team_ID, stadium_ID, stadium_name, stadium_country, time_slot, date, assigned_jury_username, rating) VALUES ({session_id}, {team_id}, {stadium_id}, "{stadium_name}", "{stadium_country}", {time_slot}, "{current_date}", "{assigned_jury_username}", NULL)')
    return Response("Match session added", status=status.HTTP_200_OK)


@api_view(['POST'])
def view_rating_stats(request):
    data = request.data
    jury_username = data['jury_username']
    cursor = connection.cursor()
    cursor.execute(f'SELECT AVG(rating), COUNT(rating) FROM MatchSession WHERE assigned_jury_username = "{jury_username}" AND rating IS NOT NULL')
    rating, count = cursor.fetchone()
    if count == 0:
        return Response("No ratings found", status=status.HTTP_404_NOT_FOUND)
    return Response({'average_rating': rating, "rating_count": count})


@api_view(["POST"])
def rate_match_session(request):
    data = request.data
    session_id = data['session_id']
    rating = data['rating']
    if rating < 0 or rating > 5:
        return Response("Rating must be between 0 and 5", status=status.HTTP_400_BAD_REQUEST)
    jury_username = data['jury_username']
    cursor = connection.cursor()
    cursor.execute(f'SELECT COUNT(*) FROM MatchSession WHERE session_ID = {session_id} AND assigned_jury_username = "{jury_username}"')
    if cursor.fetchone()[0] == 0:
        return Response("Match session not found or unassigned jury", status=status.HTTP_404_NOT_FOUND)
    cursor.execute(f'UPDATE MatchSession SET rating = {rating} WHERE session_ID = {session_id}')
    return Response("Match session rated", status=status.HTTP_200_OK)


@api_view(['POST'])
def view_players(request):
    data = request.data
    player_username = data['player_username']
    cursor = connection.cursor()
    cursor.execute(f"""SELECT name, surname, height, COUNT(*) 
                   FROM SessionSquads S 
                   INNER JOIN Player P ON S.played_player_username = P.username 
                   WHERE played_player_username != "{player_username}" AND session_ID IN 
                        (SELECT session_ID 
                        FROM SessionSquads 
                        WHERE played_player_username = "{player_username}")
                   GROUP BY username""")
    players = cursor.fetchall()
    cursor.execute(f"""
        SELECT AVG(height) FROM
            (SELECT height FROM SessionSquads S 
            INNER JOIN Player P ON S.played_player_username = P.username
            WHERE played_player_username != "{player_username}" 
            AND session_ID IN 
                (SELECT session_ID FROM SessionSquads
		        WHERE played_player_username = "{player_username}")
	            GROUP BY username
	            HAVING COUNT(*) >= ALL 
                    (SELECT COUNT(*) FROM SessionSquads S INNER JOIN Player P ON S.played_player_username = P.username
		            WHERE played_player_username != "{player_username}" AND session_ID IN 
                        (SELECT session_ID FROM SessionSquads
                        WHERE played_player_username = "{player_username}")
		            GROUP BY username)) AS H""")
    avg_height = cursor.fetchone()[0]
    
    return Response({'players': players, "avg_height": avg_height})


@api_view(['GET'])
def get_players(request):
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM Player")
    players = cursor.fetchall()
    return Response({'players': players})