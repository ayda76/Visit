from rest_framework import generics, viewsets
from rest_framework.response import Response

from rest_framework.decorators import action
from datetime import datetime, timedelta, date

from django.db import transaction
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination, LimitOffsetPagination

from rest_framework.response import Response

from doctor_app.api.filters import DoctorFilter
from account_app.models import (Role,
                                Status,
                                Account
                               )
from doctor_app.permissions import Admin_Permissions,Provider_Review_Permissions,ProviderApplication_Permissions
from book_app.models import Appointment
from doctor_app.tasks import send_acceptance_email
from doctor_app.api.filters import ProviderFilter
from doctor_app.api.serializers import (CenterSerializer,
                                         ExpertizeSerializer,
                                         SubExpertizeSerializer,
                                         DoctorSerializer,
                                         ProviderSerializer,
                                         ProviderRelatedSerializer,
                                         ProviderApplicationSerializer,
                                         ProviderReviewSerializer) 
                                  
from doctor_app.models import (StatusApplication,
                                Center,
                                Provider,
                                Expertize,
                                SubExpertize,
                                Doctor,
                                ProviderApplication,
                                ProviderReview)

from doctor_app.api.services import add_patient,add_account_application,list_cached



class CenterViewSet(viewsets.ModelViewSet):
    queryset = Center.objects.select_related('manager')
    serializer_class = CenterSerializer
    permission_classes=[Admin_Permissions]
    pagination_class=None
    my_tags = ["Doctor"]
    
    def list(self, request, *args, **kwargs):
        
        data=list_cached(self,request,"center")
        
        return Response(data)


class ExpertizeViewSet(viewsets.ModelViewSet):
    queryset = Expertize.objects.all()
    serializer_class = ExpertizeSerializer
    permission_classes=[Admin_Permissions]
    pagination_class=None
    my_tags = ["Doctor"]
    
class SubExpertizeViewSet(viewsets.ModelViewSet):
    queryset = SubExpertize.objects.select_related('expertize_related')
    serializer_class =SubExpertizeSerializer
    permission_classes=[Admin_Permissions]
    pagination_class=None
    my_tags = ["Doctor"]
    
class DoctorViewSet(viewsets.ModelViewSet):
    queryset =  Doctor.objects.select_related('provider_related','expertize_related').prefetch_related('providers_recommended','subExpertize_relateds')
    serializer_class =  DoctorSerializer
    permission_classes=[Admin_Permissions]
    pagination_class=None
    my_tags = ["Doctor"]
    
    filterset_class=DoctorFilter
    filter_backends=[DjangoFilterBackend,
                    filters.SearchFilter,
                    # filters.OrderingFilter,
                    ]
    search_fields = [
        'provider_related__account_related__firstname',
        'provider_related__account_related__lastname',
    ]
    def list(self, request, *args, **kwargs):
        data=list_cached(self,request,"doctor")
        
        return Response(data)

class ProviderViewSet(viewsets.ModelViewSet):
    queryset =  Provider.objects.select_related('account_related','Center_related')
    serializer_class =  ProviderSerializer
    permission_classes=[Admin_Permissions]
    my_tags = ["Doctor"]
    
    pagination_class=PageNumberPagination
    pagination_class.page_size=5
    filterset_class=ProviderFilter
    filter_backends=[DjangoFilterBackend]

    #/doctor/Provider/{id}/slots/
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
    permission_classes=[ProviderApplication_Permissions]
    pagination_class=None
    my_tags = ["Doctor"]
    
    def perform_create(self,serializer):
        instance=add_account_application(self,serializer)
            
    @action(detail=True, methods=['post'])
    def review(self,request,pk=None):
        account_logedin= Account.get_user_jwt(self,request)
        if account_logedin.role!= Role.ADMIN:
            return Response({"error": "Invalid login"}, status=401)
        
        providerapplication_selected=self.get_object()
        decision=request.data.get('decision')
       
        account_related=providerapplication_selected.account_related
        with transaction.atomic():
            #assigning status and roles to accounts
            if decision=='approve':
                account_related.status=Status.ACTIVE
                providerapplication_selected.status=StatusApplication.ACCEPTED
                providerapplication_selected.is_approved=True 
                if account_related.role==Role.DOCTOR_PENDING:
                    provider = Provider.objects.create(account_related=account_related ,is_active=True)
                    account_related.role=Role.DOCTOR
                    account_related.save()

                elif account_related.role==Role.CENTER_PENDING:
                    center_created=Center.objects.create(manager=account_related)
                    provider = Provider.objects.create(account_related=account_related,Center_related=center_created ,is_active=True)
                    account_related.role=Role.CENTER_MANAGER
                    account_related.save()
                else:
                    providerapplication_selected.is_approved=False
                    return Response({"error": "Invalid application"}, status=400)
                
                #send email to user
                send_acceptance_email.delay(account_related.email,True)
            
            elif decision=='reject':
                account_related.status=Status.REJECTED
                providerapplication_selected.status=StatusApplication.REJECTED
                providerapplication_selected.is_approved=False
                #send email to user
                send_acceptance_email.delay(account_related.email,False)
        
            else:
                return Response({"error": "Invalid decision"}, status=400)
        
            account_related.save()
            providerapplication_selected.save()
            
        application_serialized=ProviderApplicationSerializer(providerapplication_selected).data
        return Response(application_serialized)
        
        
class ProviderReviewViewSet(viewsets.ModelViewSet):
    queryset =  ProviderReview.objects.all()
    serializer_class =  ProviderReviewSerializer
    permission_classes=[Provider_Review_Permissions]
    pagination_class=None
    my_tags = ["Doctor"]   
                
    def perform_create(self,serializer):
        instance=add_patient(self,serializer)
    

