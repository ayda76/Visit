import pytest
import factory

from django.core.files.uploadedfile import SimpleUploadedFile
from account_app.models import Status
from doctor_app.models import (ProviderApplication, 
                               ProviderReview,
                               Expertize,
                               Provider,
                               Center)
from factories.factory_account import AccountFactory
from factories.factory_doctor import (CenterFactory,
                                      ProviderFactory,
                                      ExpertizeFactory,
                                      SubExpertizeFactory,
                                      DoctorFactory,
                                      ProviderApplicationFactory,
                                      ProviderReviewFactory
                                      )

from doctor_app.api.serializers import (CenterSerializer,
                                        ExpertizeSerializer,
                                        SubExpertizeSerializer,
                                        DoctorSerializer,
                                        ProviderSerializer,
                                        ProviderRelatedSerializer,
                                        ProviderApplicationSerializer,
                                        ProviderReviewSerializer)


@pytest.mark.django_db
class TestCenterSerializer:
    def test_create_center(self):

        account=AccountFactory()
        data = {
            "name":'test',
            "manager": account.id
        }

        serializer = CenterSerializer(data=data)

        assert serializer.is_valid(), serializer.errors

        center = serializer.save()

        assert center.id is not None
        assert isinstance(center, Center)
        
    def test_serializer_output(self):    
        center=CenterFactory()
        serializer_data=CenterSerializer(center).data
        
        assert serializer_data['name'] is not None
        assert serializer_data['organizationID'] is not None
        assert serializer_data['manager'] == center.manager.id
        
    def test_partial_update(self):
        center=CenterFactory()
        serializer=CenterSerializer(center,data={'name':'test'},partial=True)
        assert serializer.is_valid()
        updated_center=serializer.save()
        assert updated_center.name == 'test'
        
    def test_invalid_partial_update(self):
        center=CenterFactory()
        serializer=CenterSerializer(center,data={'manager':None},partial=True)
     
        assert  serializer.is_valid() == False
        print(f"serializer errors:::{serializer.errors}")
        
        


@pytest.mark.django_db
class TestProviderSerializer:
    
    def test_create_provider(self):
        center=CenterFactory()
        account=AccountFactory()
        data = {
            "name":'test',
            "account_related": account.id,
            "Center_related":center.id
        }

        serializer = ProviderSerializer(data=data)

        assert serializer.is_valid(), serializer.errors

        provider = serializer.save()

        assert provider.id is not None
        assert isinstance(provider, Provider)
        
    def test_serializer_output(self):    
        provider=ProviderFactory()
        serializer_data=ProviderRelatedSerializer(provider).data
        
        assert serializer_data['name'] is not None
        assert serializer_data['account_related']['firstname'] == provider.account_related.firstname
        assert serializer_data['Center_related']['name']==provider.Center_related.name
        
    def test_partial_update(self):
        provider=ProviderFactory()
        serializer=ProviderSerializer(provider,data={'name':'test1'},partial=True)
        assert serializer.is_valid()
        updated_provider=serializer.save()
        assert updated_provider.name == 'test1'
        
    def test_invalid_partial_update(self):
        provider=ProviderFactory()
        serializer=ProviderSerializer(provider,data={'account_related':None},partial=True)
     
        assert  serializer.is_valid() == False
        print(f"serializer errors:::{serializer.errors}")
        
        

@pytest.mark.django_db
class TestExpertizeSerializer:
    def test_create_expertize(self):
       
        data = {
           
            "name":'test',
            "description": 'test test'
           
        }

        serializer = ExpertizeSerializer(data=data)

        assert serializer.is_valid(), serializer.errors

        expertize = serializer.save()

        assert expertize.id is not None
        assert isinstance(expertize, Expertize)
      
    def test_serializer_output(self):    
        expertize=ExpertizeFactory()
        serializer_data=ExpertizeSerializer(expertize).data
        
        assert serializer_data['name'] is not None

        
    def test_partial_update(self):
        expertize=ExpertizeFactory()
        serializer=ExpertizeSerializer(expertize,data={'name':'testx'},partial=True)
        assert serializer.is_valid()
        updated_expertize=serializer.save()
        assert updated_expertize.name == 'testx'
   
@pytest.mark.django_db
class TestSubExpertizeSerializer:
    def test_create_subexpertize(self):
        expertize=ExpertizeFactory()
       
        data = {
            "expertize_related":expertize.id,
            "name":'test',
            "description": 'test test'
        }

        serializer = SubExpertizeSerializer(data=data)

        assert serializer.is_valid(), serializer.errors

        subexpertize = serializer.save()

        assert subexpertize.id is not None
        assert subexpertize.expertize_related.id== expertize.id  

    def test_serializer_output(self):    
        subexpertize=SubExpertizeFactory()
        serializer_data=SubExpertizeSerializer(subexpertize).data
        
        assert serializer_data['name'] is not None
        assert serializer_data['expertize_related'] == subexpertize.expertize_related.id
        
    def test_partial_update(self):
        subexpertize=SubExpertizeFactory()
        serializer=SubExpertizeSerializer(subexpertize,data={'name':'test'},partial=True)
        assert serializer.is_valid()
        updated_subexpertize=serializer.save()
        assert updated_subexpertize.name == 'test'
        
    def test_invalid_partial_update(self):
        subexpertize=SubExpertizeFactory()
        serializer=SubExpertizeSerializer(subexpertize,data={'expertize_related':None},partial=True)
     
        assert  serializer.is_valid() == False
        print(f"serializer errors:::{serializer.errors}")
 
    

@pytest.mark.django_db
class TestDoctorSerializer:
    def test_create_doctor(self):
        provider = ProviderFactory()
        expertize = ExpertizeFactory()

        data = {
            "provider_related": provider.id,
            "expertize_related": expertize.id,
            "email": "doctor@test.com"
        }

        serializer = DoctorSerializer(data=data)

        assert serializer.is_valid(), serializer.errors

        doctor = serializer.save()

        assert doctor.id is not None
        assert doctor.email == "doctor@test.com"    
            
    def test_serializer_output(self):    
        doctor=DoctorFactory()
        serializer_data=DoctorSerializer(doctor).data
    
        assert serializer_data['email'] ==doctor.email
        assert serializer_data['provider_related'] == doctor.provider_related.id
        
    def test_provider_can_have_only_one_doctor(self):
        provider = ProviderFactory()
        expertize=ExpertizeFactory()
        DoctorFactory(provider_related=provider)
        data={
            'provider_related':provider.id,
            'expertize_related':expertize.id,
            'email': 'test@gmail.com'}
        
        serializer = DoctorSerializer(data=data)
        
        assert serializer.is_valid() is False
        assert "provider_related" in serializer.errors   
             
    def test_partial_update(self):
        doctor=DoctorFactory()
        serializer=DoctorSerializer(doctor,data={'email':'test@gmail.com'},partial=True)
        assert serializer.is_valid()
        updated_doctor=serializer.save()
        updated_doctor.refresh_from_db()
        assert updated_doctor.email == 'test@gmail.com'
        
    def test_invalid_partial_update(self):
        doctor=DoctorFactory()
        serializer=DoctorSerializer(doctor,data={'email':None},partial=True)
     
        assert  serializer.is_valid() == False
        assert "email" in serializer.errors
               
@pytest.mark.django_db               
class TestProviderApplicationSerialiser:
    def test_serializer_output(self):    

        account=AccountFactory()
        providerapplication=ProviderApplicationFactory(account_related=account)

        serializer_data = ProviderApplicationSerializer(providerapplication).data

        assert serializer_data['account_related'] ==account.id

    def test_create_provider_application_change_account_status(self):
        account=AccountFactory(status=Status.PENDING)
    
        data={
            'role_requested':'doctor',
            'account_related':account.id,
            'documents': SimpleUploadedFile("test.jpg", b"file_content",content_type="image/jpeg")}
        serializer = ProviderApplicationSerializer(data=data)


        assert serializer.is_valid(), serializer.errors
        result=serializer.save()
        account.refresh_from_db()
        assert account.status == Status.PENDING_REVIEW
        
        assert isinstance(result, ProviderApplication)
        assert ProviderApplication.objects.count() == 1
        
    def test_account_can_have_only_one_provider_application(self):
        account = AccountFactory()
        ProviderApplicationFactory(account_related=account)
        data={
            'role_requested':'doctor',
            'account_related':account.id,
            'documents': SimpleUploadedFile("test.jpg", b"file_content",content_type="image/jpeg")}
        
        serializer = ProviderApplicationSerializer(data=data)
        
        assert serializer.is_valid() is False
        assert "account_related" in serializer.errors
        


    

@pytest.mark.django_db
class TestProviderReviewSerializer:
    def test_create_provider_review(self):    
        account=AccountFactory()
        provider=ProviderFactory()
        data={
            'patient_related':account.id,
            'provider_related':provider.id,
            'rating':3,
            'comment':' xx xx xx'
            
        }
        serializer=ProviderReviewSerializer(data=data)
    
        assert serializer.is_valid() 
        result=serializer.save()
        assert isinstance(result, ProviderReview)
        
    def test_serializer_output(self):    
        providerreview=ProviderReviewFactory()
        serializer_data=ProviderReviewSerializer(providerreview).data
    
        assert serializer_data['comment'] is not None
        assert serializer_data['provider_related'] == providerreview.provider_related.id
        
    def test_partial_update(self):
        providerreview=ProviderReviewFactory()
        serializer=ProviderReviewSerializer(providerreview,data={'comment':'test comment'},partial=True)
        assert serializer.is_valid()
        updated_providerreview=serializer.save()
        assert updated_providerreview.comment == 'test comment'
        
    def test_invalid_partial_update(self):
        providerreview=ProviderReviewFactory()
        serializer=ProviderReviewSerializer(providerreview,data={'rating':''},partial=True)
     
        assert  serializer.is_valid() == False
        print(f"serializer errors:::{serializer.errors}")    