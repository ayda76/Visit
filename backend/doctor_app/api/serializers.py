from rest_framework import serializers
from django.conf import settings
from django.contrib.auth.models import User

from account_app.api.serializers import AccountSerializer
from account_app.models import (Role,
                                Status,
                                Account
                               )
from doctor_app.models import (StatusApplication,
                                Center,
                                Provider,
                                Expertize,
                                SubExpertize,
                                Doctor,
                                ProviderApplication,
                                ProviderReview)



  
class CenterSerializer(serializers.ModelSerializer):

    class Meta:
        model = Center
        fields = '__all__'

# class MedicalServiceSerializer(serializers.ModelSerializer):

#     class Meta:
#         model = MedicalService
#         fields = '__all__'


class ExpertizeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Expertize
        fields = '__all__'
        
class SubExpertizeSerializer(serializers.ModelSerializer):

    class Meta:
        model = SubExpertize
        fields = '__all__'
        
class DoctorSerializer(serializers.ModelSerializer):

    class Meta:
        model = Doctor
        fields = '__all__'
        
class ProviderSerializer(serializers.ModelSerializer):

    class Meta:
        model = Provider
        fields = '__all__'   

class ProviderRelatedSerializer(serializers.ModelSerializer):
    account_related=AccountSerializer(required=False)
    Center_related=CenterSerializer(required=False)
    class Meta:
        model = Provider
        fields = '__all__'   
        
class ProviderApplicationSerializer(serializers.ModelSerializer):
    
    class Meta:
        model= ProviderApplication
        fields ='__all__'
        
    def create(self,validated_data):
        account = validated_data["account_related"]
        application = super().create(validated_data)
        account.status = Status.PENDING_REVIEW
        account.save()
        return application
    
    
class ProviderReviewSerializer(serializers.ModelSerializer):
    
    class Meta:
        model= ProviderReview
        fields ='__all__'   
    