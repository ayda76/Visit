from django.contrib import admin

from .resources import *
from import_export.admin import ImportExportModelAdmin 
# Register your models here.
from .models import *



@admin.register(Expertize)
class ExpertizeAdmin(ImportExportModelAdmin):

    list_display = ('id','name' )
    resource_class = ExpertizeResource
    
@admin.register(SubExpertize)
class SubExpertizeAdmin(ImportExportModelAdmin):

    list_display = ('id','name' )
    resource_class = SubExpertizeResource
    
@admin.register(Doctor)
class DoctorAdmin(ImportExportModelAdmin):

    list_display = ('id','degree','phone1','phone2' )
    resource_class = DoctorResource
    
@admin.register(Service)
class ServiceAdmin(ImportExportModelAdmin):

    list_display = ('id','name','phone1','phone2' )
    resource_class = ServiceResource

@admin.register(Provider)
class ProviderAdmin(ImportExportModelAdmin):

    list_display = ('id','type_provider' )
    resource_class = ProviderResource