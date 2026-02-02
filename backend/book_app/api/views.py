
from rest_framework import generics, viewsets
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework import status

from rest_framework import generics
from django.db.models import Q
from rest_framework.views import APIView

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import action

from datetime import datetime, timedelta, date
from rest_framework.response import Response

from account_app.api.serializers import *
from account_app.models import *

from book_app.api.serializers import *
from book_app.models import *

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.select_related('provider_related','patient')
    serializer_class = AppointmentSerializer
    pagination_class=None
    my_tags = ["Book"]
