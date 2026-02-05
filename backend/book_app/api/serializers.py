from rest_framework import serializers

from book_app.models import *
from django.db import transaction, IntegrityError

  
class AppointmentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Appointment
        fields = '__all__'
        validators=[]
        
    def create(self,validated_data):
        provider_related=validated_data['provider_related']
        date=validated_data['date']
        start_time=validated_data['start_time']
        end_time=validated_data['end_time']
            
            
        with transaction.atomic():
            reserved_appointment=Appointment.objects.filter(provider_related=provider_related,date=date,start_time=start_time,end_time=end_time, is_canceled=False)
                
            if reserved_appointment.exists():
                raise serializers.ValidationError('این نوبت قبلا رزرو شده است')
                
            try:
                return super().create(validated_data)
            except IntegrityError:
                raise serializers.ValidationError('این نوبت الان رزرو شد')