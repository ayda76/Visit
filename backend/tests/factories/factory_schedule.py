import factory
from faker import Faker
from datetime import time
from schedule_app.models import (WorkDay,
                               WorkHour)

from .factory_doctor import ProviderFactory
fake=Faker()


class WorkDayFactory(factory.django.DjangoModelFactory):
    class Meta:
        model=WorkDay
        
    day = factory.Iterator(WorkDay.Weekday.values)
    duration_min = factory.Iterator([10, 15, 20, 30, 60])
    provider_related=factory.SubFactory(ProviderFactory)


class WorkHourFactory(factory.django.DjangoModelFactory):
    class Meta:
        model=WorkHour
        

    workday_related=factory.SubFactory(WorkDayFactory)

    start_time = factory.Sequence(lambda n: time(9 + (n % 8), 0))

    end_time = factory.LazyAttribute(lambda obj: time(obj.start_time.hour + 3, 0))
