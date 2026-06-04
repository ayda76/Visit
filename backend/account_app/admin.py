from django.contrib import admin
from import_export.admin import ImportExportModelAdmin 

from .resources import AccountResource
from .models import Account

# Register your models here.


@admin.register(Account)
class AccountAdmin(ImportExportModelAdmin):

    list_display = ('id','firstname','lastname', )
    resource_class = AccountResource