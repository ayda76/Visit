import pytest
from rest_framework.test import APIClient

from unittest.mock import patch
from datetime import date, time

from factories.factory_account import AccountFactory
from factories.factory_doctor import ProviderFactory
from factories.factory_book import AppointmentFactory
from book_app.models import Appointment
from tests.utils import generate_access_token

# SUCCESS TEST
@pytest.mark.django_db
def test_appointment_create_with_jwt():
    client=APIClient()
    
    provider=ProviderFactory()
    patient=AccountFactory()
    user=patient.user
    
    token=generate_access_token(user)
 
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
    data = {
        "provider_related": provider.id,

        "date": date.today(),
        "start_time": time(10, 0),
        "end_time": time(10, 30),}    
    response=client.post('/book/Appointment/',data)
    
    assert response.status_code ==201
    
    assert response.data["provider_related"] == provider.id
    
    assert Appointment.objects.count() == 1
    appointment = Appointment.objects.first()
    assert appointment.patient.id == patient.id
  
# #AUTH TEST  
@pytest.mark.django_db
def test_comment_create_not_login():
    client=APIClient()
    provider=ProviderFactory()
    data = {
        "provider_related": provider.id,

        "date": date.today(),
        "start_time": time(10, 0),
        "end_time": time(10, 30),}      

   
    response=client.post('/book/Appointment/',data)
    
    assert response.status_code ==401
    assert Appointment.objects.count() == 0


  

@pytest.mark.django_db
def test_comment_create_with_invalid_token():
    client=APIClient()
    
    provider=ProviderFactory()
    
    client.credentials(HTTP_AUTHORIZATION=f"Bearer invalid token")
    
    data = {
        "provider_related": provider.id,

        "date": date.today(),
        "start_time": time(10, 0),
        "end_time": time(10, 30),}    
    response=client.post('/book/Appointment/',data)
    
    assert response.status_code ==401
    
    assert Appointment.objects.count() == 0
   
  

# #VALIDATION TEST
@pytest.mark.django_db
def test_comment_create_with_invalid_data():
    client=APIClient()
    
    provider=ProviderFactory()
    patient=AccountFactory()
    user=patient.user
    
    token=generate_access_token(user)
 
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
    #sending  obj instead of id
    data = {
        "provider_related": provider,

        "date": date.today(),
        "start_time": time(10, 0),
        "end_time": time(10, 30),}    
    response=client.post('/book/Appointment/',data)
    
    assert response.status_code ==400
    
    assert Appointment.objects.count() == 0
   