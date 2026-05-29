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

    





class Appointment(models.Model):
    class Weekday(models.IntegerChoices):
        MONDAY = 0, 'Monday'
        TUESDAY = 1, 'Tuesday'
        WEDNESDAY = 2, 'Wednesday'
        THURSDAY = 3, 'Thursday'
        FRIDAY = 4, 'Friday'
        SATURDAY = 5, 'Saturday'
        SUNDAY = 6, 'Sunday'

    weekday           = models.PositiveSmallIntegerField(choices=Weekday.choices, default=0)
    date              = models.DateField()
    start_time        = models.TimeField()
    end_time          = models.TimeField()
    provider_related  = models.ForeignKey(Provider,related_name='provider_appointment',on_delete=models.CASCADE,blank=True, null=True)
    patient           = models.ForeignKey(Account,related_name='patient_appointment',on_delete=models.CASCADE,blank=True, null=True)
    is_canceled       = models.BooleanField(default=False)
    
    created_at        = models.DateTimeField(auto_now_add=True)
    updated_at        = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ("provider_related", "date", "start_time", "end_time")