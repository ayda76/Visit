from rest_framework import serializers
from schedule_app.models import (WorkHour,WorkDay)



class WorkDaySerializer(serializers.ModelSerializer):

    class Meta:
        model = WorkDay
        fields = '__all__'


class WorkHourSerializer(serializers.ModelSerializer):

    class Meta:
        model = WorkHour
        fields = '__all__'