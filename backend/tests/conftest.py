import pytest
from django.contrib.auth.models import User

from pytest_factoryboy import register
from factories.factory_user import UserFactory
from factories.factory_account import AccountFactory
from factories.factory_book import AppointmentFactory
from factories.factory_schedule import (WorkDayFactory,
                                        WorkHourFactory)
from factories.factory_doctor import (ProviderFactory,
                                      ProviderReviewFactory,
                                      ExpertizeFactory,
                                      SubExpertizeFactory,
                                      CenterFactory,
                                      DoctorFactory,
                                      ProviderApplicationFactory)

register(UserFactory)

register(AccountFactory)
register(AppointmentFactory)
register(WorkDayFactory)
register(WorkHourFactory)
register(ProviderFactory)
register(ProviderReviewFactory)
register(ExpertizeFactory)
register(SubExpertizeFactory)
register(CenterFactory)
register(DoctorFactory)
register(ProviderApplicationFactory)
