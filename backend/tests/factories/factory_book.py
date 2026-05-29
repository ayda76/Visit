import factory
from faker import Faker
from datetime import date, time, timedelta
from django.utils import timezone

from book_app.models import (Appointment,
                            )
from .factory_user import UserFactory
from .factory_account import AccountFactory
from .factory_doctor import ProviderFactory
fake=Faker()


class AppointmentFactory(factory.django.DjangoModelFactory):
    class Meta:
        model=Appointment

    date =  factory.Sequence(
    lambda n: timezone.now().date() + timedelta(days=n))
    start_time = factory.LazyAttribute(lambda o: time(9, 0))
    end_time = factory.LazyAttribute(lambda o: time(10, 0))
    provider_related = factory.SubFactory(ProviderFactory)
    patient = factory.SubFactory(AccountFactory,patient=True)
    
    weekday = factory.Iterator([
    Appointment.Weekday.MONDAY,
    Appointment.Weekday.TUESDAY,
    Appointment.Weekday.WEDNESDAY,])
    
    is_canceled=False
    # is_canceled = factory.Faker("boolean")
    #is_canceled =factory.Iterator([True, False])

    

