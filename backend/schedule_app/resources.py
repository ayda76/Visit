from import_export import resources
from .models import (WorkDay,
                     WorkHour)


class WorkDayResource(resources.ModelResource):
     class Meta:
          model = WorkDay
          

class WorkHourResource(resources.ModelResource):
     class Meta:
          model = WorkHour
          