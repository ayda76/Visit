from django.contrib import admin
from import_export.admin import ImportExportModelAdmin 

from .resources import AppointmentResource
from .models import Appointment
# Register your models here.


@admin.register(Appointment)
class AppointmentAdmin(ImportExportModelAdmin):

    list_display = ('id', )
    resource_class = AppointmentResource