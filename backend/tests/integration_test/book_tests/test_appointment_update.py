import pytest
from rest_framework.test import APIClient

from unittest.mock import patch
from datetime import date, time

from factories.factory_account import AccountFactory
from factories.factory_doctor import ProviderFactory
from factories.factory_book import AppointmentFactory
from book_app.models import Appointment
from tests.utils import generate_access_token

# SUCCESS TESTS
@pytest.mark.django_db
def test_appointment_update_with_jwt():
    account=AccountFactory()
    user=account.user
    token=generate_access_token(user)
    
    client=APIClient()
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
    provider=ProviderFactory()
    appointment=AppointmentFactory(provider_related=provider,patient=account)
    response=client.patch(f'/book/Appointment/{appointment.id}/',{'is_canceled':True})

    assert response.status_code==200
    appointment.refresh_from_db()
    assert Appointment.objects.count() ==1
    assert response.data['is_canceled'] == True
   
#AUTH TEST  
@pytest.mark.django_db
def test_appointment_update_not_login():
    account=AccountFactory()
    client=APIClient()
    provider=ProviderFactory()
    
    appointment=AppointmentFactory(provider_related=provider,patient=account)
    response=client.patch(f'/book/Appointment/{appointment.id}/',{'is_canceled':True})

    assert response.status_code==401
    appointment.refresh_from_db()

    assert appointment.is_canceled == False
  
@pytest.mark.django_db
def test_appointment_update_with_invalid_token():
    client=APIClient()    
    account=AccountFactory()

    client.credentials(HTTP_AUTHORIZATION=f'Bearer invalid token')
    provider=ProviderFactory()
    appointment=AppointmentFactory(provider_related=provider,patient=account)
    response=client.patch(f'/book/Appointment/{appointment.id}/',{'is_canceled':True})

    assert response.status_code==401
    appointment.refresh_from_db()

    assert appointment.is_canceled == False
    
    
@pytest.mark.django_db
def test_appointment_update_with_wrong_account():
    account_patient=AccountFactory()
    account_strenger=AccountFactory()
    user=account_strenger.user
    token=generate_access_token(user)
    
    client=APIClient()
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
    provider=ProviderFactory()
    appointment=AppointmentFactory(provider_related=provider,patient=account_patient)
    response=client.patch(f'/book/Appointment/{appointment.id}/',{'is_canceled':True})
    
    assert response.status_code==401
    appointment.refresh_from_db()

    assert appointment.is_canceled == False


# VALIDATION TEST
@pytest.mark.django_db
def test_appointment_update_with_invalid_data():
    account=AccountFactory()
    user=account.user
    token=generate_access_token(user)
    
    client=APIClient()
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
    provider=ProviderFactory()
    appointment=AppointmentFactory(provider_related=provider,patient=account)
    response=client.patch(f'/book/Appointment/{appointment.id}/',{'is_canceled':'test'})

    
    assert response.status_code==400
    appointment.refresh_from_db()

    assert appointment.is_canceled == False