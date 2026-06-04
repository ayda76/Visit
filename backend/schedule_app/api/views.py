
from rest_framework import generics, viewsets

from schedule_app.permissions import (WorkDay_Permissions,
                                      WorkHour_Permissions)

from schedule_app.api.serializers import (WorkDaySerializer,
                                          WorkHourSerializer)
from schedule_app.models import (WorkDay,
                                 WorkHour)

class WorkDayViewSet(viewsets.ModelViewSet):
    queryset = WorkDay.objects.all()
    serializer_class = WorkDaySerializer
    permission_classes=[WorkDay_Permissions]
    pagination_class=None
    my_tags = ["Schedule"]
    
class WorkHourViewSet(viewsets.ModelViewSet):
    queryset = WorkHour.objects.all()
    serializer_class = WorkHourSerializer
    permission_classes =[WorkHour_Permissions]
    pagination_class=None
    my_tags = ["Schedule"]