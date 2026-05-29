import pytest
from factories.factory_book import AppointmentFactory


@pytest.mark.django_db
class TestAppointmentModel:
    def test_appointment_creation(self):
        appointment=AppointmentFactory()
        assert appointment.id is not None
        assert appointment.is_canceled == False
        
    def test_appointment_str(self):
        appointment=AppointmentFactory()
        
        assert str(appointment) == str(appointment.id)
                