

import factory
from faker import Faker
from schedule_app.models import (WorkDay,
                               WorkHour)

from .factory_doctor import ProviderFactory
fake=Faker()


class WorkDayFactory(factory.django.DjangoModelFactory):
    class Meta:
        model=WorkDay
        

    provider_related=factory.SubFactory(ProviderFactory)


class WorkHourFactory(factory.django.DjangoModelFactory):
    class Meta:
        model=WorkHour
        

    workday_related=factory.SubFactory(WorkDayFactory)

    # start_time = factory.Faker("fake_name")
    # end_time = factory.Faker("fake_name")
