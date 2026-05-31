from rest_framework.exceptions import ValidationError
from account_app.models import Account


def add_account(self,serializer):
        try:    
            account_login=Account.get_user_jwt(self,self.request)
            instance=serializer.save(profile_related=account_login)
            return instance 
        except:
            raise ValidationError({"detail":"login problem"}) 
        
     