from rest_framework.exceptions import ValidationError
from django.core.cache import cache

from account_app.models import (Account,
                                Role,
                                Status)


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
    
def list_cached(self, request, key):
    params = request.GET.urlencode()
    cache_key = f"{key}:list:{params or 'all'}"
    cached_data = cache.get(cache_key)
    if cached_data is not None:
        return cached_data
    ##we use self.filter_queryset so when returning list and filtering we dont get doctor.objects.all()     
    queryset = self.filter_queryset(self.get_queryset())
    serializer = self.get_serializer(queryset,many=True)
        
    cache.set(cache_key,serializer.data,timeout=300)
        
    return serializer.data