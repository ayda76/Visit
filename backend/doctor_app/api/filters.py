import django_filters
from doctor_app.models import Provider
                           



class ProviderFilter(django_filters.FilterSet):
    class Meta:
        model =Provider
        fields={
            'account_related__firstname':['iexact','icontains'],
            'account_related__lastname' :['iexact','icontains'],
            'provider_doctor__expertize_related__name':['iexact','icontains'],
            'provider_doctor__subExpertize_relateds__name': ['iexact', 'icontains'],
            'provider_doctor__organizationID':['exact']
            
        }