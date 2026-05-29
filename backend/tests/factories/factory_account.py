import factory
from faker import Faker
from django.core.files.uploadedfile import SimpleUploadedFile

from account_app.models import Account, Role,Status
from tests.factories import UserFactory


fake=Faker()

class AccountFactory(factory.django.DjangoModelFactory):
    class Meta:
        model=Account

    user=factory.SubFactory(UserFactory)
    firstname = factory.Faker("first_name")
    lastname = factory.Faker("last_name")
    email = factory.Sequence(lambda n: f"user{n}@test.com")
    #phone=factory.Sequence(lambda n: int(f"9{n:010d}"))
    phone=factory.Faker("numerify", text="09123654876")
    img = factory.LazyFunction(
        lambda: SimpleUploadedFile(
            "avatar.jpg",
            b"file_content",
            content_type="image/jpeg"
        )
    )
    role = Role.PATIENT
    status = Status.PENDING
    
    class Params:
        ####role
        patient = factory.Trait(
            role=Role.PATIENT
        )

        doctor_pending = factory.Trait(
            role=Role.DOCTOR_PENDING
        )
        
        doctor = factory.Trait(
            role=Role.DOCTOR
        )
        
        center_pending = factory.Trait(
            role=Role.CENTER_PENDING
        )
        
        center_manager = factory.Trait(
            role=Role.CENTER_MANAGER
        )
        admin = factory.Trait(
            role=Role.ADMIN
        )   
        ####status
        pending = factory.Trait(
            role=Status.PENDING
        )  
        
        pending_review = factory.Trait(
            role=Status.PENDING_REVIEW
        )  
                
        active = factory.Trait(
            role=Status.ACTIVE
        )  
        
        rejected = factory.Trait(
            role=Status.REJECTED
        )  
        
        suspended = factory.Trait(
            role=Status.SUSPENDED
        )  

#AccountFactory(doctor=True)
