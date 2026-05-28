import factory
from faker import Faker
from account_app.models import Account
from tests.factories import UserFactory


fake=Faker()

class AccountFactory(factory.django.DjangoModelFactory):
    class Meta:
        model=Account
        
    user=factory.SubFactory(UserFactory)
    firstname = factory.Faker("first_name")
    lastname = factory.Faker("last_name")
    email = factory.Sequence(lambda n: f"user{n}@test.com")
    
