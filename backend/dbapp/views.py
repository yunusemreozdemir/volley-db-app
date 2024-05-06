from django.shortcuts import render, get_object_or_404
from django.db import connection
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework import status

from .serializers import UserSerializer


@api_view(['POST'])
def create_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        user = User.objects.get(username=request.data['username'])
        user.set_password(request.data['password'])
        user.save()
        token = Token.objects.create(user=user)
        return Response({'token': token.key, 'user': serializer.data})
    return Response(serializer.errors, status=status.HTTP_200_OK)


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

@api_view(['GET'])
def get_players(request):
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM Player")
    players = cursor.fetchall()
    return Response({'players': players})