import pytest
from datetime import date, time
from rest_framework import serializers

from factories.factory_doctor import ProviderFactory
from factories.factory_account import AccountFactory
from factories.factory_book import AppointmentFactory
from book_app.api.serializers import AppointmentSerializer
from book_app.models import Appointment

@pytest.mark.django_db
def test_account_serializer_output():
    
    appointment = AppointmentFactory()

    serializer = AppointmentSerializer(appointment)

    assert serializer.data["id"] == appointment.id
    assert serializer.data["provider_related"] == appointment.provider_related.id  

@pytest.mark.django_db
def test_create_appointment_successfully():
    patient = AccountFactory()
    provider = ProviderFactory()
    data = {
        "provider_related": provider.id,
        "patient": patient.id,
        "date": date.today(),
        "start_time": time(10, 0),
        "end_time": time(10, 30),}
    
    serializer = AppointmentSerializer(data=data)

    assert serializer.is_valid(), serializer.errors

    appointment = serializer.save()
    assert appointment.id is not None
    assert Appointment.objects.count() == 1
    
@pytest.mark.django_db
def test_not_booking_reserved_appointment():
    provider = ProviderFactory()
    booked_appointment=AppointmentFactory(
        provider_related=provider,
        date=date(2026,1,1),
        start_time=time(10,0),
        end_time=time(10,30),
        is_canceled=False)
    
    data={
        'provider_related':provider.id,
        'date':date(2026,1,1),
        'start_time':time(10,0),
        'end_time':time(10,30),
        'is_canceled':False
        }
    serializer=AppointmentSerializer(data=data)
    
    assert  serializer.is_valid()
    with pytest.raises(serializers.ValidationError) as exc:
        serializer.save()

    assert "قبلا رزرو شده" in str(exc.value)
    
    
    
    
@pytest.mark.django_db
def test_booking_canceled_appointment():
    provider = ProviderFactory()
    canceled_appointment=AppointmentFactory(
        provider_related=provider,
        date=date(2026,1,1),
        start_time=time(10,0),
        end_time=time(10,30),
        is_canceled=True)
    
    data={
        'provider_related':provider.id,
        'date':date(2026,1,1),
        'start_time':time(10,0),
        'end_time':time(10,30),
        'is_canceled':False
        }
    serializer=AppointmentSerializer(data=data)
    
    assert  serializer.is_valid()
    appointment = serializer.save()
    assert appointment.id is not None
    assert Appointment.objects.count() == 2