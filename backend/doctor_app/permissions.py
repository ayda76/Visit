from rest_framework import permissions

from account_app.models import Account,Role



class Admin_Permissions(permissions.BasePermission):
   
    def has_permission(self, request,view):
      
        if  request.method=='POST':
            return self.can_create_appointment(request)
        
        return True
        
    def can_create_appointment(self, request):
        account_logedin= Account.get_user_jwt(self,request)
        if account_logedin.role == Role.ADMIN:
            return True
        else: 
            return False
        
    def has_object_permission(self, request, view, obj):

        #get is safe method
        if request.method in permissions.SAFE_METHODS:
            return True

        account_logedin = Account.get_user_jwt(self, request)

        return account_logedin.role == Role.ADMIN


class ProviderApplication_Permissions(permissions.BasePermission):
   
    def has_permission(self, request,view):
      
        if  request.method=='POST':
            return self.can_create_application(request)
        
        return True
        
    def can_create_application(self, request):
        account_logedin= Account.get_user_jwt(self,request)
        if account_logedin:
            return True
        else: 
            return False
        
    def has_object_permission(self, request, view, obj):

        #get is safe method
        if request.method in permissions.SAFE_METHODS:
            return True

        account_logedin = Account.get_user_jwt(self, request)

        if  account_logedin.role==Role.ADMIN:
            return True
        else:
            return account_logedin == obj.account_related



class Provider_Review_Permissions(permissions.BasePermission):
   
    def has_permission(self, request,view):
      
        if  request.method=='POST':
            return self.can_create_review(request)
        
        return True
        
    def can_create_review(self, request):
        account_logedin= Account.get_user_jwt(self,request)
        if account_logedin.role == Role.PATIENT:
            return True
        elif account_logedin.role == Role.ADMIN:
            return True
        else: 
            return False
        
    def has_object_permission(self, request, view, obj):

        #get is safe method
        if request.method in permissions.SAFE_METHODS:
            return True

        account_logedin = Account.get_user_jwt(self, request)
        if account_logedin.role == Role.ADMIN:
            return True
        else:
            return account_logedin.id == obj.patient_related.id