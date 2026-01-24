from rest_framework import serializers
from django.conf import settings
from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from schedule_app.models import *


# class PasswordChangeSerializer(serializers.Serializer):
#     old_password = serializers.CharField(required=True)
#     new_password1 = serializers.CharField(required=True)
#     new_password2 = serializers.CharField(required=True)
    


class WorkDaySerializer(serializers.ModelSerializer):

    class Meta:
        model = WorkDay
        fields = '__all__'


class WorkHourSerializer(serializers.ModelSerializer):

    class Meta:
        model = WorkHour
        fields = '__all__'