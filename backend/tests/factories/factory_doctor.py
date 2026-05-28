import factory
from faker import Faker
from doctor_app.models import (Center,
                               Provider,
                               Expertize,
                               SubExpertize,
                               Doctor,
                               ProviderApplication,
                               ProviderReview)
from .factory_user import UserFactory
from .factory_account import AccountFactory

fake=Faker()


class CenterFactory(factory.django.DjangoModelFactory):
    class Meta:
        model=Center
        
    name=factory.Faker("fake_name")
    manager=factory.SubFactory(AccountFactory)
    organizationID=factory.Faker("XCDVFBTY8765")
    phone1=factory.Faker(09128769176)  
    phone2=factory.Faker(09127836897)  
    link=factory.Faker("https://google.com")  
    address =factory.Faker("xxx xxxx xxxx")  


class ProviderFactory(factory.django.DjangoModelFactory):
    class Meta:
        model=Provider
        
    name=factory.Faker("fake_name")
    account_related=factory.SubFactory(AccountFactory)
    Center_related=factory.SubFactory(CenterFactory)
 
class ExpertizeFactory(factory.django.DjangoModelFactory):
    class Meta:
        model=Expertize
        
    name=factory.Faker("fake_name")
    description=factory.Faker("fake text text text")
 
class SubExpertizeFactory(factory.django.DjangoModelFactory):
    class Meta:
        model=SubExpertize
        
    name=factory.Faker("fake_name")
    expertize_related=factory.SubFactory(ExpertizeFactory)
    description=factory.Faker("fake text text text")

class DoctorFactory(factory.django.DjangoModelFactory):
    class Meta:
        model=Doctor
        
    name=factory.Faker("fake_name")
    provider_related=factory.SubFactory(ProviderFactory)
    expertize_related=factory.SubFactory(ExpertizeFactory)
    degree=factory.Faker("fake_degree")
    address=factory.Faker("fake text text text")
    organizationID=factory.Faker("CXDFVGR3456")
    email= factory.Sequence(lambda n: f"user{n}@test.com")
    phone1=factory.Faker(09128769176)  
    phone2=factory.Faker(09129769176)  
    link=factory.Faker("https://google.com") 
    
class ProviderApplicationFactory(factory.django.DjangoModelFactory):
    class Meta:
        model=ProviderApplication
        
  
    account_related=factory.SubFactory(AccountFactory)



class ProviderReviewFactory(factory.django.DjangoModelFactory):
    class Meta:
        model=ProviderReview
        

    patient_related=factory.SubFactory(AccountFactory)
    provider_related=factory.SubFactory(ProviderFactory)
    comment=factory.Faker("fake text text text")
    rating=factory.Faker(3)  
   
