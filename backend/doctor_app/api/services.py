from rest_framework.exceptions import ValidationError
from account_app.models import Account, Role


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
        
     