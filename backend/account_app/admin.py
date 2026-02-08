from django.contrib import admin

from .resources import *
from import_export.admin import ImportExportModelAdmin 
# Register your models here.
from .models import *



@admin.register(Account)
class AccountAdmin(ImportExportModelAdmin):

    list_display = ('id','firstname','lastname', )
    resource_class = AccountResource