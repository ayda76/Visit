import pytest
from rest_framework.test import APIRequestFactory

from factories.factory_account import AccountFactory
from factories.factory_book import AppointmentFactory
from tests.utils import generate_access_token

@pytest.mark.django_db
class TestAppointmentModel:
    def test_appointment_creation(self):
        appointment=AppointmentFactory()
        assert appointment.id is not None
        assert appointment.is_canceled == False
        
    def test_appointment_str(self):
        appointment=AppointmentFactory()
        
        assert str(appointment) == str(appointment.id)
                