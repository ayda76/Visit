import pytest
from rest_framework.test import APIClient

from tests.utils import generate_access_token
from doctor_app.models import Doctor
from account_app.models import Role
from factories.factory_account import AccountFactory
from factories.factory_doctor import (DoctorFactory,
                                      ProviderFactory,
                                      ExpertizeFactory,
                                      SubExpertizeFactory)


##### GET ####
@pytest.mark.django_db
def test_list_doctors():
    client=APIClient()
    DoctorFactory.create_batch(4)
    
    response=client.get('/doctor/Doctor/')
    
    assert response.status_code == 200
    assert Doctor.objects.count() == 4


@pytest.mark.django_db
def test_retrieve_doctor():
    client=APIClient()
    provider=ProviderFactory()
    doctor=DoctorFactory(provider_related=provider)
    
    response=client.get(f'/doctor/Doctor/{doctor.id}/')
    
    assert response.status_code == 200

    assert response.data['provider_related'] == provider.id

  
##### DELETE #### 
@pytest.mark.django_db
def test_doctor_delete():
    account=AccountFactory(role=Role.ADMIN)
    user=account.user
    token=generate_access_token(user)
    
    client=APIClient()
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    doctor=DoctorFactory()
    response=client.delete(f'/doctor/Doctor/{doctor.id}/')

    assert response.status_code==204
    assert Doctor.objects.count() ==0   
    
@pytest.mark.django_db
def test_doctor_delete_not_admin():
    account=AccountFactory()
    user=account.user
    token=generate_access_token(user)
    
    client=APIClient()
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    doctor=DoctorFactory()
    response=client.delete(f'/doctor/Doctor/{doctor.id}/')

    assert response.status_code == 401
    assert Doctor.objects.count() == 1 
    

    
##### UPDATE ####
@pytest.mark.django_db
def test_doctor_update_with_jwt():
    account_admin=AccountFactory(role=Role.ADMIN)
    user=account_admin.user
    token=generate_access_token(user)
    
    client=APIClient()
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
    
    doctor=DoctorFactory()

    response=client.patch(f'/doctor/Doctor/{doctor.id}/',{'address':'newaddress'})

    assert response.status_code==200
    doctor.refresh_from_db()
    assert Doctor.objects.count() ==1
    assert response.data['address'] == 'newaddress'
    
@pytest.mark.django_db
def test_doctor_update_without_admin():
    account_not_admin=AccountFactory()
    
    user=account_not_admin.user
    token=generate_access_token(user)
    
    client=APIClient()
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
    
    doctor=DoctorFactory()

    response=client.patch(f'/doctor/Doctor/{doctor.id}/',{'address':'newaddress'})

    assert response.status_code==401

##### CREATE ####
@pytest.mark.django_db
def test_doctor_create_with_jwt_admin():
    client=APIClient()
    
    account_admin=AccountFactory(role=Role.ADMIN)
    user=account_admin.user
    token=generate_access_token(user)
 
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
    
    provider=ProviderFactory()
    expertize=ExpertizeFactory()
    subexpertize=SubExpertizeFactory()
    data={
        "provider_related":provider.id,
        "subExpertize_relateds": [subexpertize.id],
        "expertize_related":expertize.id,
        "degree":"name",
        "organizationID":"gsfsgshj",
        "email":'test@test.com',
        "address":"test",
        "phone1":"09127836897",
        "phone2":"09127736897", 
        "link": "name",
        "providers_recommended":[provider.id]
    }
 
    response=client.post('/doctor/Doctor/',data)
    
    assert response.status_code ==201 , response.data
    
    assert response.data["organizationID"] == 'gsfsgshj'
    
    assert Doctor.objects.count() == 1
    doctor = Doctor.objects.first()
    assert doctor.provider_related.id == provider.id
    
@pytest.mark.django_db
def test_doctor_create_without_admin():
    client=APIClient()
    
    account_not_admin=AccountFactory()
    user=account_not_admin.user
    token=generate_access_token(user)
 
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
    provider=ProviderFactory()
    expertize=ExpertizeFactory()
    subexpertize=SubExpertizeFactory()
    data={
        "provider_related":provider.id,
        "subExpertize_relateds": [subexpertize.id],
        "expertize_related":expertize.id,
        "degree":'test',
        "organizationID":'575435',
        "email":'test@test.com',
        "providers_recommended":[provider.id]
    }
    response=client.post('/doctor/Doctor/',data)
    
    assert response.status_code ==401
    assert Doctor.objects.count() == 0
