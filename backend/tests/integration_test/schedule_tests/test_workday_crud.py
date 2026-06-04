import pytest
from rest_framework.test import APIClient

from unittest.mock import patch
from datetime import date, time

from tests.utils import generate_access_token
from factories.factory_account import AccountFactory
from factories.factory_doctor import ProviderFactory
from factories.factory_schedule import WorkDayFactory,WorkHourFactory
from schedule_app.models import WorkDay,WorkHour
from account_app.models import Account,Role


##### GET ####
@pytest.mark.django_db
def test_list_workdays():
    client=APIClient()
    WorkDayFactory.create_batch(4)
    
    response=client.get('/schedule/WorkDay/')
    
    assert response.status_code == 200
    assert WorkDay.objects.count() == 4


@pytest.mark.django_db
def test_retrieve_workday():
    client=APIClient()
    provider=ProviderFactory()
    workday=WorkDayFactory(provider_related=provider)
    
    response=client.get(f'/schedule/WorkDay/{workday.id}/')
    
    assert response.status_code == 200

    assert response.data['provider_related'] == provider.id
    
##### DELETE #### 
@pytest.mark.django_db
def test_workday_delete_admin():
    account=AccountFactory(role=Role.ADMIN)
    user=account.user
    token=generate_access_token(user)
    
    client=APIClient()
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    workday=WorkDayFactory()
    response=client.delete(f'/schedule/WorkDay/{workday.id}/')

    assert response.status_code==204
    assert WorkDay.objects.count() ==0   
 
@pytest.mark.django_db
def test_workday_delete_provider_account():
    account=AccountFactory(role=Role.CENTER_MANAGER)
    user=account.user
    token=generate_access_token(user)
    
    client=APIClient()
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
    proivder=ProviderFactory(account_related=account)
    workday=WorkDayFactory(provider_related=proivder)
    response=client.delete(f'/schedule/WorkDay/{workday.id}/')

    assert response.status_code==204
    assert WorkDay.objects.count() ==0      
    
@pytest.mark.django_db
def test_workday_delete_not_admin_or_provider_account():
    account=AccountFactory()
    user=account.user
    token=generate_access_token(user)
    
    client=APIClient()
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
    
    account_center=AccountFactory(role=Role.CENTER_MANAGER)
    provider=ProviderFactory(account_related=account_center)
    workday=WorkDayFactory(provider_related=provider)
    
    response=client.delete(f'/schedule/WorkDay/{workday.id}/')

    assert response.status_code == 401
    assert WorkDay.objects.count() == 1 
    
    
    
##### UPDATE ####
@pytest.mark.django_db
def test_workday_update_with_admin():
    account_admin=AccountFactory(role=Role.ADMIN)
    user=account_admin.user
    token=generate_access_token(user)
    
    client=APIClient()
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
    
    workday=WorkDayFactory()

    response=client.patch(f'/schedule/WorkDay/{workday.id}/',{'is_active':False})

    assert response.status_code==200
    workday.refresh_from_db()
    assert WorkDay.objects.count() ==1
    assert response.data['is_active'] == False

@pytest.mark.django_db
def test_workday_update_with_provider_account():
    account_doctor=AccountFactory(role=Role.DOCTOR)
    user=account_doctor.user
    token=generate_access_token(user)
    
    client=APIClient()
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
    
    provider=ProviderFactory(account_related=account_doctor)
    workday=WorkDayFactory(provider_related=provider)

    response=client.patch(f'/schedule/WorkDay/{workday.id}/',{'is_active':False})

    assert response.status_code==200
    workday.refresh_from_db()
    assert WorkDay.objects.count() ==1
    assert response.data['is_active'] == False
        
@pytest.mark.django_db
def test_workday_update_without_admin_or_provider_account():
    account_not_admin=AccountFactory()
    
    user=account_not_admin.user
    token=generate_access_token(user)
    
    client=APIClient()
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
    
    account_center=AccountFactory(role=Role.CENTER_MANAGER)
    provider=ProviderFactory(account_related=account_center)
    workday=WorkDayFactory(provider_related=provider)

    response=client.patch(f'/schedule/WorkDay/{workday.id}/',{'is_active':False})

    assert response.status_code==401

##### CREATE ####

@pytest.mark.django_db
def test_workday_create_with_jwt_provider_account():
    client=APIClient()
    
    account_doctor=AccountFactory(role=Role.DOCTOR)
    user=account_doctor.user
    token=generate_access_token(user)
 
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
   

    provider=ProviderFactory(account_related=account_doctor)
    data={
        "day":0,
        "provider_related":provider.id,
        "duration_min":30,
        "is_active":True
    }
    response=client.post('/schedule/WorkDay/',data)
    
    assert response.status_code ==201
    
    assert WorkDay.objects.count() == 1
    workday = WorkDay.objects.first()
    assert workday.provider_related.account_related.id == account_doctor.id
    
    
@pytest.mark.django_db
def test_workday_create_with_jwt_admin():
    client=APIClient()
    
    account_admin=AccountFactory(role=Role.ADMIN)
    user=account_admin.user
    token=generate_access_token(user)
 
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    provider=ProviderFactory()
    data={
        "day":0,
        "provider_related":provider.id,
        "duration_min":30,
        "is_active":True
    }
    response=client.post('/schedule/WorkDay/',data)
    
    assert response.status_code ==201

    assert WorkDay.objects.count() == 1
    workday = WorkDay.objects.first()
    assert workday.provider_related.id == provider.id
    
@pytest.mark.django_db
def test_workday_create_without_admin_or_provider_account():
    client=APIClient()
    
    account_patient=AccountFactory(role=Role.PATIENT)
    user=account_patient.user
    token=generate_access_token(user)
 
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    provider=ProviderFactory()
    data={
        "day":0,
        "provider_related":provider.id,
        "duration_min":30,
        "is_active":True
    }
    response=client.post('/schedule/WorkDay/',data)
    
    assert response.status_code ==401
    assert WorkDay.objects.count() == 0


# class WorkDay(models.Model):
#     class Weekday(models.IntegerChoices):
#         MONDAY = 0, 'Monday'
#         TUESDAY = 1, 'Tuesday'
#         WEDNESDAY = 2, 'Wednesday'
#         THURSDAY = 3, 'Thursday'
#         FRIDAY = 4, 'Friday'
#         SATURDAY = 5, 'Saturday'
#         SUNDAY = 6, 'Sunday'

#     day =models.PositiveSmallIntegerField(choices=Weekday.choices, default=0)
#     provider_related =models.ForeignKey(Provider,on_delete=models.CASCADE,related_name='provider_workday',null=True)
#     duration_min = models.PositiveIntegerField(default=10)
#     is_active = models.BooleanField(default=True)
#     def __str__(self) :