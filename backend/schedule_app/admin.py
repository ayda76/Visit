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



@admin.register(Schedule)
class ScheduleAdmin(ImportExportModelAdmin):

    list_display = ('id',)
    resource_class = ScheduleResource

