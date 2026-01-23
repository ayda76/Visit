from django.contrib import admin
from django.contrib import admin

from .resources import *
from import_export.admin import ImportExportModelAdmin 
# Register your models here.
from .models import *



@admin.register(WorkDay)
class WorkDayAdmin(ImportExportModelAdmin):

    list_display = ('id', )
    resource_class = WorkDayResource



@admin.register(WorkHour)
class WorkHourAdmin(ImportExportModelAdmin):

    list_display = ('id',)
    resource_class = WorkHourResource

