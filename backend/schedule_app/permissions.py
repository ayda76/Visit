from rest_framework import permissions

from account_app.models import Account,Role,Status


class WorkDay_Permissions(permissions.BasePermission):
   
    def has_permission(self, request,view):
      
        if  request.method=='POST':
            return self.can_create_workday(request)
        
        return True
        
    def can_create_workday(self, request):
        account_logedin= Account.get_user_jwt(self,request)
        if account_logedin.role ==Role.DOCTOR:
            return True
        elif account_logedin.role ==Role.CENTER_MANAGER:
            return True
        elif account_logedin.role ==Role.ADMIN:
            return True
        else: 
            return False
        
    def has_object_permission(self, request, view, obj):

        if request.method in permissions.SAFE_METHODS:
            return True

        account_logedin = Account.get_user_jwt(self, request)
        if account_logedin.role ==Role.ADMIN:
            return True
        else:
            return obj.provider_related.account_related.id == account_logedin.id     

class WorkHour_Permissions(permissions.BasePermission):
   
    def has_permission(self, request,view):
      
        if  request.method=='POST':
            return self.can_create_workhour(request)
        
        return True
        
    def can_create_workhour(self, request):
        account_logedin= Account.get_user_jwt(self,request)
        if account_logedin.role ==Role.DOCTOR:
            return True
        elif account_logedin.role ==Role.CENTER_MANAGER:
            return True
        elif account_logedin.role ==Role.ADMIN:
            return True
        else: 
            return False
        
    def has_object_permission(self, request, view, obj):

        if request.method in permissions.SAFE_METHODS:
            return True

        account_logedin = Account.get_user_jwt(self, request)
        if account_logedin.role ==Role.ADMIN:
            return True
        else:
            return obj.workday_related.provider_related.account_related.id == account_logedin.id     
