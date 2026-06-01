import pytest
from rest_framework.test import APIClient

from unittest.mock import patch
from datetime import date, time

from factories.factory_account import AccountFactory
from factories.factory_doctor import ProviderFactory
from factories.factory_book import AppointmentFactory
from book_app.models import Appointment
from tests.utils import generate_access_token



@pytest.mark.django_db
def test_list_appointments():
    client=APIClient()
    AppointmentFactory.create_batch(4)
    
    response=client.get('/book/Appointment/')
    
    assert response.status_code == 200
    assert Appointment.objects.count() == 4


@pytest.mark.django_db
def test_retrieve_appointment():
    client=APIClient()
    patient=AccountFactory()
    provider=ProviderFactory()
    appointment=AppointmentFactory(provider_related=provider,patient=patient)
    
    response=client.get(f'/book/Appointment/{appointment.id}/')
    
    assert response.status_code == 200

    assert response.data['patient']==patient.id
    
    
