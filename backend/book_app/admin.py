from django.contrib import admin

from .resources import *
from import_export.admin import ImportExportModelAdmin 
# Register your models here.
from .models import *



@admin.register(Appointment)
class AppointmentAdmin(ImportExportModelAdmin):

    list_display = ('id', )
    resource_class = AppointmentResource