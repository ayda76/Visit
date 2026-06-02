
from rest_framework import generics, viewsets
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework import status

from rest_framework import generics
from django.db.models import Q
from django.contrib.auth.forms import PasswordChangeForm
from rest_framework.views import APIView
from drf_yasg.utils import swagger_auto_schema 

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import action

from schedule_app.api.services import add_provider
from account_app.api.serializers import *
from account_app.models import Account

from schedule_app.api.serializers import *
from schedule_app.models import *

class WorkDayViewSet(viewsets.ModelViewSet):
    queryset = WorkDay.objects.all()
    serializer_class = WorkDaySerializer
    pagination_class=None
    my_tags = ["Schedule"]
    
    def perform_create(self,serializer):
        instance=add_provider(self,serializer)
        
    
class WorkHourViewSet(viewsets.ModelViewSet):
    queryset = WorkHour.objects.all()
    serializer_class = WorkHourSerializer
    pagination_class=None
    my_tags = ["Schedule"]