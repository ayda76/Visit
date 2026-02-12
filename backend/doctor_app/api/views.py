
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

from book_app.models import Appointment
from django.db import transaction
from doctor_app.tasks import send_acceptance_email


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

        appointments_selected=Appointment.objects.filter(
            provider_related=instance_provider,
            date__range=[start_date,start_date+timedelta(days=6)],
            is_canceled=False
        )
        
        reserved={
            (appointment.date,appointment.start_time,appointment.end_time):True
            for appointment in appointments_selected
        }
        
        result=[]
        
        for index in range(7):
            current_date=start_date+timedelta(days=index)
            
            workday_selected=instance_provider.provider_workday.filter(day=current_date.weekday(), is_active=True).first()
            data={
                'date':current_date.isoformat(),
                'weekday':current_date.weekday(),
                'slots':[]
                
            }
            
            if not workday_selected:
                result.append(data)
                continue
            
            
            duration=timedelta(minutes=workday_selected.duration_min)
            
            selected_hours=workday_selected.workhour_workday.all()
            for hour_selected in selected_hours:  
                start_dt = datetime.combine(current_date, hour_selected.start_time)
                end_dt   = datetime.combine(current_date, hour_selected.end_time)
                
                
                slot_start=start_dt
                while slot_start <end_dt:
                    slot_end=slot_start + duration
                    if slot_end>end_dt:
                        break
                    #key value: if the current data is in the reserved dict then returns True
                    is_reserved=reserved.get(
                        (current_date,slot_start.time(),slot_end.time()),
                        False
                    )
                    slot={
                        "start":slot_start.time().isoformat(),
                        "end":slot_end.time().isoformat(),
                        "reserved":is_reserved
                    }
                    data['slots'].append(slot)
                    slot_start=slot_end
                    
            result.append(data)
            
            
        return Response(result)
                
  
           
class ProviderApplicationViewSet(viewsets.ModelViewSet):
    queryset =  ProviderApplication.objects.all()
    serializer_class =  ProviderApplicationSerializer
    pagination_class=None
    my_tags = ["Doctor"]
    
    @action(detail=True, methods=['post'])
    def review(self,request,pk=None):
        
        providerapplication_selected=self.get_object()
        decision=request.data.get('decision')
       
        account_related=providerapplication_selected.account_related
        with transaction.atomic():
            #assigning status and roles to accounts
            if decision=='approve':
                account_related.status=Status.ACTIVE
                providerapplication_selected.status=StatusApplication.ACCEPTED
                if account_related.role==Role.DOCTOR_PENDING:
                    provider = Provider.objects.create(account=account_related ,is_active=True)
                    account_related.role=Role.DOCTOR
                elif account_related.role==Role.CENTER_PENDING:
                    center_created=Center.objects.create(manager=account_related)
                    provider = Provider.objects.create(Center_related=center_created ,is_active=True)
                    account_related.role=Role.CENTER_MANAGER
                #send email to user
                send_acceptance_email.delay(account_related,True)
            
            elif decision=='reject':
                account_related.status=Status.REJECTED
                providerapplication_selected.status=StatusApplication.REJECTED
                #send email to user
                send_acceptance_email.delay(account_related,False)
        
            else:
                return Response({"error": "Invalid decision"}, status=400)
        
        account_related.save()
        providerapplication_selected.save()

        return Response({"status":providerapplication_selected.status})
        
        
           
           
           
       
                
        
    
