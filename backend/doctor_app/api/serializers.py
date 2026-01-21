from rest_framework import serializers
from django.conf import settings
from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from doctor_app.models import *


# class PasswordChangeSerializer(serializers.Serializer):
#     old_password = serializers.CharField(required=True)
#     new_password1 = serializers.CharField(required=True)
#     new_password2 = serializers.CharField(required=True)
    

  
class ServiceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Service
        fields = '__all__'

class ExpertizeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Expertize
        fields = '__all__'
        
class SubExpertizeSerializer(serializers.ModelSerializer):

    class Meta:
        model = SubExpertize
        fields = '__all__'
        
class DoctorSerializer(serializers.ModelSerializer):

    class Meta:
        model = Doctor
        fields = '__all__'
        
class ProviderSerializer(serializers.ModelSerializer):

    class Meta:
        model = Provider
        fields = '__all__'   