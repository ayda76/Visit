import pytest
from datetime import date, time
from rest_framework.test import APIClient
from factories.factory_account import AccountFactory
from factories.factory_doctor import ProviderFactory
from factories.factory_schedule import WorkDayFactory,WorkHourFactory
from factories.factory_book import AppointmentFactory
from schedule_app.models import (WorkDay,
                               WorkHour)
from book_app.models import Appointment

@pytest.mark.django_db
def test_slots_empty_when_no_workday():
    provider=ProviderFactory()
    client=APIClient()
    #/doctor/Provider/{id}/slots/
    response=client.get(f"/doctor/Provider/{provider.id}/slots/")
    today=date.today()
    
    assert response.status_code == 200
    assert response.data[0]['date'] == today.isoformat()
    slots=response.data[0]['slots'] 
    assert len(slots) == 0



@pytest.mark.django_db
def test_slots_generated_from_workhours():
    provider=ProviderFactory()
    today=date.today()
    workday=WorkDayFactory(provider_related=provider,
                           day=WorkDay.Weekday(today.weekday()),
                           duration_min=15)
    
    workhour=WorkHourFactory(workday_related=workday,
                             start_time=time(9,0),
                             end_time=time(10,0))
    
    client=APIClient()
    response=client.get(f"/doctor/Provider/{provider.id}/slots/")
    

    print(f"xxx {response.data}")
    assert response.status_code == 200
    assert response.data[0]['date'] == today.isoformat()
    slots=response.data[0]['slots'] 
    assert len(slots) == 4


@pytest.mark.django_db
def test_reserved_slot_marked_true():
    today=date.today()
    provider=ProviderFactory()
    today=date.today()
    appointment_reserved=AppointmentFactory(
        
        weekday=Appointment.Weekday(today.weekday()),
        date=today.isoformat(),
        start_time=time(9,0),
        end_time=time(9,15),
        provider_related=provider,
        is_canceled=False,
    )
    

    workday=WorkDayFactory(provider_related=provider,
                           day=WorkDay.Weekday(today.weekday()),
                           duration_min=15)
    
    workhour=WorkHourFactory(workday_related=workday,
                             start_time=time(9,0),
                             end_time=time(10,0))
    
    client=APIClient()
    response=client.get(f"/doctor/Provider/{provider.id}/slots/")
    
 
    print(f"xxx {response.data}")
    assert response.status_code == 200
    assert response.data[0]['date'] == today.isoformat()
    slots=response.data[0]['slots'] 
    assert slots[0]['reserved'] == True
    assert slots[2]['reserved'] == False
    
    
@pytest.mark.django_db
def test_canceled_appointment_not_reserved():
    today=date.today()
    provider=ProviderFactory()
    today=date.today()
    appointment_not_reserved=AppointmentFactory(
        
        weekday=Appointment.Weekday(today.weekday()),
        date=today.isoformat(),
        start_time=time(9,0),
        end_time=time(9,15),
        provider_related=provider,
        is_canceled=True,
    )
    

    workday=WorkDayFactory(provider_related=provider,
                           day=WorkDay.Weekday(today.weekday()),
                           duration_min=15)
    
    workhour=WorkHourFactory(workday_related=workday,
                             start_time=time(9,0),
                             end_time=time(10,0))
    
    client=APIClient()
    response=client.get(f"/doctor/Provider/{provider.id}/slots/")
    
    
    print(f"xxx {response.data}")
    assert response.status_code == 200
    assert response.data[0]['date'] == today.isoformat()
    slots=response.data[0]['slots'] 
    assert slots[0]['reserved'] == False
    
@pytest.mark.django_db
def test_slots_respect_start_date():
    
    provider=ProviderFactory()
    
    client=APIClient()
    response=client.get(f"/doctor/Provider/{provider.id}/slots/?start_date=2026-01-05")
    
    assert response.status_code == 200
    assert response.data[0]['date'] == "2026-01-05"