from rest_framework.exceptions import ValidationError
from account_app.models import Account, Role,Status


def add_provider(self,serializer):
    
    try:    
        account_login=Account.get_user_jwt(self,self.request)
        if account_login.role == Role.DOCTOR:
            instance=serializer.save(provider_related=account_login)
            return instance 
        elif account_login.role == Role.CENTER_MANAGER:
            instance=serializer.save(provider_related=account_login)
            return instance 
        elif account_login.role == Role.ADMIN:
            instance=serializer.save()
            return instance 
    except:
        raise ValidationError({"detail":"login problem"}, status=400) 
        