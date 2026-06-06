from django.contrib import admin
from import_export.admin import ImportExportModelAdmin 

from .resources import (CenterResource,
                        ExpertizeResource,
                        SubExpertizeResource,
                        DoctorResource,
                        ProviderResource,
                        ProviderApplicationResource,
                        ProviderReviewResource)


from .models import (Center,
                     Expertize,
                     SubExpertize,
                     Doctor,
                     Provider,
                     ProviderApplication,
                     ProviderReview)

# Register your models here.

@admin.register(Center)
class CenterAdmin(ImportExportModelAdmin):

    list_display = ('id','name','phone1','phone2' )
    resource_class = CenterResource


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
    

@admin.register(Provider)
class ProviderAdmin(ImportExportModelAdmin):

    list_display = ('id' ,)
    resource_class = ProviderResource

@admin.register(ProviderApplication)
class ProviderApplicationAdmin(ImportExportModelAdmin):

    list_display = ('id' ,)
    resource_class = ProviderApplicationResource

@admin.register(ProviderReview)
class ProviderReviewAdmin(ImportExportModelAdmin):

    list_display = ('id' ,)
    resource_class = ProviderReviewResource    
