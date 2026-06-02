from rest_framework.exceptions import ValidationError
from account_app.models import Account, Role,Status


def add_patient(self,serializer):
    
    try:    
        account_login=Account.get_user_jwt(self,self.request)
        if account_login.role == Role.PATIENT:
            instance=serializer.save(patient_related=account_login)
            return instance 
        elif account_login.role == Role.ADMIN:
            instance=serializer.save()
            return instance 
    except:
        raise ValidationError({"detail":"login problem"}) 
        
def add_account_application(self,serializer):
    
    try:    
        account_login=Account.get_user_jwt(self,self.request)
        if account_login.role != Role.PATIENT:
            instance=serializer.save(account_related=account_login)
            account_login.status = Status.PENDING_REVIEW
            account_login.save()
            return instance 
        elif account_login.role == Role.ADMIN:
            instance=serializer.save()
            return instance 
    except:
        raise ValidationError({"detail":"login problem"})      