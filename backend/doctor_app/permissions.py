from rest_framework import permissions

from account_app.models import (Account,
                                Role)



class Admin_Permissions(permissions.BasePermission):
   
    def has_permission(self, request,view):
      
        if  request.method=='POST':
            return self.can_create_subj(request)
        
        return True
        
    def can_create_subj(self, request):
        account_logedin= Account.get_user_jwt(self,request)
        if account_logedin:
            return account_logedin.role == Role.ADMIN
        else: 
            return False
        
    def has_object_permission(self, request, view, obj):

        #get is safe method
        if request.method in permissions.SAFE_METHODS:
            return True

        account_logedin = Account.get_user_jwt(self, request)
        if account_logedin:
            return account_logedin.role == Role.ADMIN
        else:
            return False


class ProviderApplication_Permissions(permissions.BasePermission):

        
    def has_permission(self, request,view):
      
        if  request.method=='POST':
            return self.can_create_application(request)
        elif request.method=='GET':
            return self.can_get_applications(request)
        else:
            return True
        
    def can_create_application(self, request):
        account_logedin= Account.get_user_jwt(self,request)
        if account_logedin:
            return account_logedin.role in [Role.ADMIN,Role.DOCTOR_PENDING,Role.CENTER_PENDING]
        else: 
            return False
        
    def can_get_applications(self, request):
        account_logedin = Account.get_user_jwt(self, request)
        return account_logedin is not None    
        
    def has_object_permission(self, request, view, obj):
          
        account_logedin = Account.get_user_jwt(self, request)

        if not account_logedin:
            return False

        if account_logedin.role == Role.ADMIN:
            return True

        return account_logedin == obj.account_related         
    


class Provider_Review_Permissions(permissions.BasePermission):
   
    def has_permission(self, request,view):
      
        if  request.method=='POST':
            return self.can_create_review(request)
        
        return True
        
    def can_create_review(self, request):
        account_logedin= Account.get_user_jwt(self,request)
        if account_logedin:
            if account_logedin.role in [Role.PATIENT,Role.ADMIN]:
                return True
         
        return False
        
    def has_object_permission(self, request, view, obj):

        #get is safe method
        if request.method in permissions.SAFE_METHODS:
            return True

        account_logedin = Account.get_user_jwt(self, request)
        if account_logedin==None:
            return False
        
        if account_logedin.role == Role.ADMIN:
            return True
        else:
            return account_logedin.id == obj.patient_related.id