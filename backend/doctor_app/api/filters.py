import django_filters
from doctor_app.models import Provider,Center,Doctor

class CenterFilter(django_filters.FilterSet):
    class Meta:
        model =Center
        fields={
     
            'manager__firstname':['iexact','icontains'],
            'manager__account_related__lastname':['iexact','icontains'],
            'name': ['iexact', 'icontains'],   
        }
               

                
class DoctorFilter(django_filters.FilterSet):
    class Meta:
        model =Doctor
        fields={
     
            'provider_related__account_related__firstname':['iexact','icontains'],
            'provider_related__account_related__lastname':['iexact','icontains'],
            'expertize_related__name': ['iexact', 'icontains'],   
        }


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