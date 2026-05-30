import factory
from faker import Faker
import uuid
from factory import LazyFunction
from django.core.files.uploadedfile import SimpleUploadedFile
from .factory_account import AccountFactory
from doctor_app.models import (Center,
                               Provider,
                               Expertize,
                               SubExpertize,
                               Doctor,
                               ProviderApplication,
                               ProviderReview,
                               StatusApplication)



fake=Faker()


class CenterFactory(factory.django.DjangoModelFactory):
    class Meta:
        model=Center
        
    name=factory.Faker("name")
    manager=factory.SubFactory(AccountFactory)
    organizationID=LazyFunction(uuid.uuid4)
    phone1=factory.Faker("numerify", text="09123654876") 
    phone2=factory.Faker("numerify", text="09127836897")
    link=factory.Faker("name")  
    address =factory.Faker("text")  


class ProviderFactory(factory.django.DjangoModelFactory):
    class Meta:
        model=Provider
        
    name=factory.Faker("name")
    account_related=factory.SubFactory(AccountFactory)
    Center_related=factory.SubFactory(CenterFactory)
    is_active=True
 
class ExpertizeFactory(factory.django.DjangoModelFactory):
    class Meta:
        model=Expertize
        
    name=factory.Faker("name")
    description=factory.Faker("text")
 
class SubExpertizeFactory(factory.django.DjangoModelFactory):
    class Meta:
        model=SubExpertize
        
    name=factory.Faker("name")
    expertize_related=factory.SubFactory(ExpertizeFactory)
    description=factory.Faker("text")

class DoctorFactory(factory.django.DjangoModelFactory):
    class Meta:
        model=Doctor
        

    provider_related=factory.SubFactory(ProviderFactory)
    expertize_related=factory.SubFactory(ExpertizeFactory)
    degree=factory.Faker("name")
    address=factory.Faker("text")
    organizationID=LazyFunction(uuid.uuid4)
    email= factory.Sequence(lambda n: f"user{n}@test.com")
    phone1=factory.Faker("numerify", text="09127836897") 
    phone2=factory.Faker("numerify", text="09127846807")
    link=factory.Faker("name") 
    
    @factory.post_generation
    def subExpertize_relateds(self, create, extracted, **kwargs):

        if not create:
            return

        if extracted:
            for item in extracted:
                self.subExpertize_relateds.add(item)
        else:
            self.subExpertize_relateds.add(SubExpertizeFactory())
    
    @factory.post_generation
    def providers_recommended(self,create,extracted,**kwargs):
        if not create:
            return
        
        if extracted:
            for item in extracted:
                self.providers_recommended.add(item)
        else:
            self.providers_recommended.add(ProviderFactory())
    
class ProviderApplicationFactory(factory.django.DjangoModelFactory):
    class Meta:
        model=ProviderApplication
        
  
    account_related=factory.SubFactory(AccountFactory)
    documents=factory.LazyFunction(
        lambda: SimpleUploadedFile(
            "testfile.txt",
            b"hello world",
            content_type="text/plain"
        )
    )
    #SimpleUploadedFile("test.pdf",b"%PDF-1.4 fake pdf content",content_type="application/pdf")
    role_requested=factory.Iterator(['doctor','center'])
    status = StatusApplication.PENDING
    
    class Params:
        ##status##
        pending = factory.Trait(
            status=StatusApplication.PENDING
        )
        accepted = factory.Trait(
            status=StatusApplication.ACCEPTED
        )
        rejected = factory.Trait(
            status=StatusApplication.REJECTED
        )


    

class ProviderReviewFactory(factory.django.DjangoModelFactory):
    class Meta:
        model=ProviderReview
        

    patient_related=factory.SubFactory(AccountFactory)
    provider_related=factory.SubFactory(ProviderFactory)
    comment=factory.Faker("text")
    rating=3
   
