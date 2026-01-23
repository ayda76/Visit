from import_export import resources
from .models import *


class WorkDayResource(resources.ModelResource):
     class Meta:
          model = WorkDay
          

class WorkHourResource(resources.ModelResource):
     class Meta:
          model = WorkHour
          