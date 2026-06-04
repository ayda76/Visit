
from rest_framework import generics, viewsets
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework import status

from rest_framework.decorators import action


from schedule_app.permissions import WorkDay_Permissions,WorkHour_Permissions
from account_app.api.serializers import *


from schedule_app.api.serializers import *
from schedule_app.models import *

class WorkDayViewSet(viewsets.ModelViewSet):
    queryset = WorkDay.objects.all()
    serializer_class = WorkDaySerializer
    permission_classes=[WorkDay_Permissions]
    pagination_class=None
    my_tags = ["Schedule"]
    

        
    
class WorkHourViewSet(viewsets.ModelViewSet):
    queryset = WorkHour.objects.all()
    serializer_class = WorkHourSerializer
    permisson_classes=[WorkHour_Permissions]
    pagination_class=None
    my_tags = ["Schedule"]