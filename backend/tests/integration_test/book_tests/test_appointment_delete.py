import pytest
from rest_framework.test import APIClient

from factories.factory_account import AccountFactory
from factories.factory_doctor import ProviderFactory
from factories.factory_book import AppointmentFactory
from book_app.models import Appointment
from tests.utils import generate_access_token


# SUCCESS TESTS
@pytest.mark.django_db
def test_appointment_delete_with_jwt():
    account=AccountFactory()
    user=account.user
    token=generate_access_token(user)
    
    client=APIClient()
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
    provider=ProviderFactory()
    appointment=AppointmentFactory(provider_related=provider,patient=account)
    response=client.delete(f'/book/Appointment/{appointment.id}/')

    assert response.status_code==204
    assert Appointment.objects.count() ==0
    
@pytest.mark.django_db
def test_appointment_delete_not_login():
    
    client=APIClient()
    account=AccountFactory()
    provider=ProviderFactory()
    appointment=AppointmentFactory(provider_related=provider,patient=account)
    response=client.delete(f'/book/Appointment/{appointment.id}/')

    assert response.status_code == 401
    assert Appointment.objects.count() == 1
    
@pytest.mark.django_db
def test_appointment_delete_with_invalid_token():
    account=AccountFactory()
   
    client=APIClient()
    client.credentials(HTTP_AUTHORIZATION=f'Bearer invalid token')
    provider=ProviderFactory()
    appointment=AppointmentFactory(provider_related=provider,patient=account)
    response=client.delete(f'/book/Appointment/{appointment.id}/')

    assert response.status_code == 401
    
    assert Appointment.objects.count() == 1
    
    
@pytest.mark.django_db
def test_appointment_delete_with_wrong_account():
    account_appointment=AccountFactory()
    account_strenger=AccountFactory()
    user=account_strenger.user
    token=generate_access_token(user)
    
    client=APIClient()
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
    provider=ProviderFactory()
    appointment=AppointmentFactory(provider_related=provider,patient=account_appointment)
    response=client.delete(f'/book/Appointment/{appointment.id}/')

    assert response.status_code == 401
    
    assert Appointment.objects.count() == 1
    