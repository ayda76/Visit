
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

from doctor_app.api.serializers import *
from doctor_app.models import *

class CenterViewSet(viewsets.ModelViewSet):
    queryset = Center.objects.select_related('manager').prefetch_related('providers_recommended')
    serializer_class = CenterSerializer
    pagination_class=None
    my_tags = ["Doctor"]


# class MedicalServiceViewSet(viewsets.ModelViewSet):
#     queryset = MedicalService.objects.all()
#     serializer_class = MedicalServiceSerializer
#     pagination_class=None
#     my_tags = ["Doctor"]

class ExpertizeViewSet(viewsets.ModelViewSet):
    queryset = Expertize.objects.all()
    serializer_class = ExpertizeSerializer
    pagination_class=None
    my_tags = ["Doctor"]
    
class SubExpertizeViewSet(viewsets.ModelViewSet):
    queryset = SubExpertize.objects.select_related('expertize_related')
    serializer_class =SubExpertizeSerializer
    pagination_class=None
    my_tags = ["Doctor"]
    
class DoctorViewSet(viewsets.ModelViewSet):
    queryset =  Doctor.objects.select_related('account_related','expertize_related').prefetch_related('providers_recommended','subExpertize_relateds')
    serializer_class =  DoctorSerializer
    pagination_class=None
    my_tags = ["Doctor"]

class ProviderViewSet(viewsets.ModelViewSet):
    queryset =  Provider.objects.select_related('doctor_related','service_related')
    serializer_class =  ProviderSerializer
    pagination_class=None
    my_tags = ["Doctor"]
    
    @action(detail=True, methods=['get'])
    def slots(self, request, pk=None):
        instance_provider=self.get_object()
        

        start_date_str = request.query_params.get('start_date')
        if start_date_str:
            start_date=date.fromisoformat(start_date_str)
        else:
            start_date=date.today()

        one_week=[
            {'date':start_date,
             'weekday':start_date.weekday},]
        
        for index in range(7):
            new_date=start_date+timedelta(day=index)
            data={
                'date':new_date,
                'weekday':new_date.weekday()
                
            }
            one_week.append(data)
            
        
        selected_workdays=instance_provider.provider_workday.all()
        week_slots=[]
        for day in selected_workdays:
            duration=timedelta(minutes=day.duration_min)
            date_day=one_week['date'][['weekday']==day.day]
            day_slots={
                    'date':date_day,
                    'day':day.day,
                    'duration':duration,
                    'hours':[]
                }
            
            selected_hours=day.workhour_workday.all()
            for hour_selected in selected_hours:
                
                start_point=hour_selected.start_time
                slots=[]
                while start_point <hour_selected.end_time:
                    end_point=start_point + duration
                    slot={
                        "start":start_point,
                        "end":end_point
                    }
                    slots.append(slot)
                    start_point=end_point
                    
                    
                day_slots['hours'].append({
                    'strat_time':hour_selected.start_time,
                    'end_time' : hour_selected.end_time,
                    'slots':slots
                })
                
            week_slots.append(day_slots)
            
        return week_slots
                
  
           

                
        
    
