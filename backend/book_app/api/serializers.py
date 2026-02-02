from rest_framework import serializers

from book_app.models import *


  
class AppointmentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Appointment
        fields = '__all__'