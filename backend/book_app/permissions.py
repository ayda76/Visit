from rest_framework import permissions

from account_app.models import Account


class Appointment_Permissions(permissions.BasePermission):
   
    def has_permission(self, request,view):
      
        if  request.method=='POST':
            return self.can_create_appointment(request)
        
        return True
        
    def can_create_appointment(self, request):
        account_logedin= Account.get_user_jwt(self,request)
        if account_logedin is not None:
            return True
        else: 
            return False
        
    def has_object_permission(self, request, view, obj):

        #get is safe method
        if request.method in permissions.SAFE_METHODS:
            return True

        account_logedin = Account.get_user_jwt(self, request)

        return obj.patient.id == account_logedin.id     
