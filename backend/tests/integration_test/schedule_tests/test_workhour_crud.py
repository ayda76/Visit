import pytest
from rest_framework.test import APIClient

from unittest.mock import patch
from datetime import date, time

from tests.utils import generate_access_token
from factories.factory_account import AccountFactory
from factories.factory_doctor import ProviderFactory
from factories.factory_schedule import WorkDayFactory,WorkHourFactory
from schedule_app.models import WorkHour,WorkDay
from account_app.models import Account,Role


 


##### GET ####
@pytest.mark.django_db
def test_list_workhours():
    client=APIClient()
    WorkHourFactory.create_batch(4)
    
    response=client.get('/schedule/WorkHour/')
    
    assert response.status_code == 200
    assert WorkHour.objects.count() == 4


@pytest.mark.django_db
def test_retrieve_workhour():
    client=APIClient()
    workday=WorkDayFactory()
    workhour=WorkHourFactory(workday_related=workday)
    
    response=client.get(f'/schedule/WorkHour/{workhour.id}/')
    
    assert response.status_code == 200

    assert response.data['workday_related'] == workday.id
    
##### DELETE #### 
@pytest.mark.django_db
def test_workhour_delete_admin():
    account=AccountFactory(role=Role.ADMIN)
    user=account.user
    token=generate_access_token(user)
    
    client=APIClient()
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    
    workhour=WorkHourFactory()
    response=client.delete(f'/schedule/WorkHour/{workhour.id}/')

    assert response.status_code==204
    assert WorkHour.objects.count() ==0   
 
@pytest.mark.django_db
def test_workhour_delete_provider_account():
    account=AccountFactory(role=Role.CENTER_MANAGER)
    user=account.user
    token=generate_access_token(user)
    
    client=APIClient()
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
    
    provider=ProviderFactory(account_related=account)
    workday=WorkDayFactory(provider_related=provider)
    workhour=WorkHourFactory(workday_related=workday)
    response=client.delete(f'/schedule/WorkHour/{workhour.id}/')

    assert response.status_code==204
    assert WorkHour.objects.count() ==0      
    
@pytest.mark.django_db
def test_workhour_delete_not_admin_or_provider_account():
    account=AccountFactory(role=Role.PATIENT)
    user=account.user
    token=generate_access_token(user)
    
    client=APIClient()
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
    
    account_center=AccountFactory(role=Role.CENTER_MANAGER)
    provider=ProviderFactory(account_related=account_center)
    workday=WorkDayFactory(provider_related=provider)
    workhour=WorkHourFactory(workday_related=workday)
    
    response=client.delete(f'/schedule/WorkHour/{workhour.id}/')

    assert response.status_code == 401
    assert WorkHour.objects.count() == 1 
    
    
##### UPDATE ####
@pytest.mark.django_db
def test_workhour_update_with_admin():
    account_admin=AccountFactory(role=Role.ADMIN)
    user=account_admin.user
    token=generate_access_token(user)
    
    client=APIClient()
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
    
    workhour=WorkHourFactory()

    response=client.patch(f'/schedule/WorkHour/{workhour.id}/',{'start_time':time(9,0)})

    assert response.status_code==200
    workhour.refresh_from_db()
    assert WorkHour.objects.count() ==1
    assert response.data['start_time'] == '09:00:00'

@pytest.mark.django_db
def test_workhour_update_with_provider_account():
    account_doctor=AccountFactory(role=Role.DOCTOR)
    user=account_doctor.user
    token=generate_access_token(user)
    
    client=APIClient()
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
    

    provider=ProviderFactory(account_related=account_doctor)
    workday=WorkDayFactory(provider_related=provider)
    workhour=WorkHourFactory(workday_related=workday)


    response=client.patch(f'/schedule/WorkHour/{workhour.id}/',{'start_time':time(9,0)})

    assert response.status_code==200
    workhour.refresh_from_db()
    assert WorkHour.objects.count() ==1
    assert response.data['start_time'] == '09:00:00'
        
@pytest.mark.django_db
def test_workhour_update_without_admin_or_provider_account():
    account_not_admin=AccountFactory(role=Role.PATIENT)
    
    user=account_not_admin.user
    token=generate_access_token(user)
    
    client=APIClient()
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
    
    account_center=AccountFactory(role=Role.CENTER_MANAGER)
    provider=ProviderFactory(account_related=account_center)

    workday=WorkDayFactory(provider_related=provider)
    workhour=WorkHourFactory(workday_related=workday)
    
    response=client.patch(f'/schedule/WorkHour/{workhour.id}/',{'start_time':time(9,0)})
    print(f"{response.data}")

    assert response.status_code==401

##### CREATE ####

@pytest.mark.django_db
def test_workhour_create_with_jwt_provider_account():
    client=APIClient()
    
    account_doctor=AccountFactory(role=Role.DOCTOR)
    user=account_doctor.user
    token=generate_access_token(user)
 
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
   

    provider=ProviderFactory(account_related=account_doctor)
    workday=WorkDayFactory(provider_related=provider)

    data={
        "workday_related":workday.id,
        "start_time":time(8,0),
        "end_time":time(11,0),

    }
    response=client.post('/schedule/WorkHour/',data)
    
    assert response.status_code ==201
    
    assert WorkHour.objects.count() == 1
    workhour = WorkHour.objects.first()
    assert workhour.workday_related.provider_related.account_related.id == account_doctor.id
    
    
@pytest.mark.django_db
def test_workhour_create_with_jwt_admin():
    client=APIClient()
    
    account_admin=AccountFactory(role=Role.ADMIN)
    user=account_admin.user
    token=generate_access_token(user)
 
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    workday=WorkDayFactory()

    data={
        "workday_related":workday.id,
        "start_time":time(8,0),
        "end_time":time(11,0),

    }
    response=client.post('/schedule/WorkHour/',data)
    
    assert response.status_code ==201

    assert WorkHour.objects.count() == 1
    workhour = WorkHour.objects.first()
    assert workhour.workday_related.id == workday.id
    
@pytest.mark.django_db
def test_workhour_create_without_admin_or_provider_account():
    client=APIClient()
    
    account_patient=AccountFactory(role=Role.PATIENT)
    user=account_patient.user
    token=generate_access_token(user)
 
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    account_center=AccountFactory(role=Role.CENTER_MANAGER)
    provider=ProviderFactory(account_related=account_center)

    workday=WorkDayFactory(provider_related=provider)

    data={
        "workday_related":workday.id,
        "start_time":time(8,0),
        "end_time":time(11,0),

    }
    response=client.post('/schedule/WorkHour/',data)
    print(f"{response.data}")
    assert response.status_code ==401
    assert WorkHour.objects.count() == 0


