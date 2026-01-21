
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

from account_app.api.serializers import *
from account_app.models import *

from doctor_app.api.serializers import *
from doctor_app.models import *

class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    pagination_class=None
    my_tags = ["Doctor"]
    
class ExpertizeViewSet(viewsets.ModelViewSet):
    queryset = Expertize.objects.all()
    serializer_class = ExpertizeSerializer
    pagination_class=None
    my_tags = ["Doctor"]
    
class SubExpertizeViewSet(viewsets.ModelViewSet):
    queryset = SubExpertize.objects.all()
    serializer_class =SubExpertizeSerializer
    pagination_class=None
    my_tags = ["Doctor"]
    
class DoctorViewSet(viewsets.ModelViewSet):
    queryset =  Doctor.objects.all()
    serializer_class =  DoctorSerializer
    pagination_class=None
    my_tags = ["Doctor"]

class ProviderViewSet(viewsets.ModelViewSet):
    queryset =  Provider.objects.all()
    serializer_class =  ProviderSerializer
    pagination_class=None
    my_tags = ["Doctor"]