import pytest
from unittest.mock import patch
from rest_framework.test import APIClient
from datetime import date, time
from tests.utils import generate_access_token
from factories.factory_account import AccountFactory
from factories.factory_doctor import ProviderFactory
from factories.factory_book import AppointmentFactory
@pytest.mark.django_db
@patch("book_app.api.views.send_booked_email")
def test_create_appointment_sends_email(mock_send_email):
    provider=ProviderFactory()
    patient=AccountFactory()

    user=patient.user
    
    token=generate_access_token(user)
    client = APIClient() 
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
    data = {
        "provider_related": provider.id,

        "date": date.today(),
        "start_time": time(10, 0),
        "end_time": time(10, 30),}
    
    response = client.post("/book/Appointment/", data)
    assert response.status_code == 201

    mock_send_email.assert_called_once_with( patient.email)

@pytest.mark.django_db
@patch("book_app.api.views.send_booked_email")
def test_cannot_book_reserved_appointment(mock_send_email):

    provider=ProviderFactory()
    other_patient=AccountFactory()
    appointment=AppointmentFactory(provider_related=provider,
                                   patient=other_patient,
                                   date=date.today(),
                                   start_time=time(10, 0),
                                   end_time=time(10, 30))    
    patient=AccountFactory()
    data = {
        "provider_related": provider.id,

        "date": date.today(),
        "start_time": time(10, 0),
        "end_time": time(10, 30),}
    client = APIClient()
    user=patient.user
    
    token=generate_access_token(user)
 
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
    response = client.post(
        "/book/Appointment/",
        data,
        format="json"
    )
    assert response.status_code == 400
    mock_send_email.assert_not_called()

 


