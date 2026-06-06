from django.contrib import admin
from import_export.admin import ImportExportModelAdmin 

from .resources import (WorkDayResource,
                        WorkHourResource)

from .models import (WorkHour,
                     WorkDay)

# Register your models here.

@admin.register(WorkDay)
class WorkDayAdmin(ImportExportModelAdmin):

    list_display = ('id', )
    resource_class = WorkDayResource



@admin.register(WorkHour)
class WorkHourAdmin(ImportExportModelAdmin):

    list_display = ('id',)
    resource_class = WorkHourResource

