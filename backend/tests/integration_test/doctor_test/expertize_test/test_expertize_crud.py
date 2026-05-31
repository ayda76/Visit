import pytest
from rest_framework.test import APIClient

from unittest.mock import patch
from datetime import date, time

from tests.utils import generate_access_token
from factories.factory_account import AccountFactory
from factories.factory_doctor import ExpertizeFactory
from doctor_app.models import Expertize
from account_app.models import Role

##### GET ####
@pytest.mark.django_db
def test_list_expertizes():
    client=APIClient()
    ExpertizeFactory.create_batch(4)
    
    response=client.get('/doctor/Expertize/')
    
    assert response.status_code == 200
    assert Expertize.objects.count() == 4


@pytest.mark.django_db
def test_retrieve_expertize():
    client=APIClient()

    expertize=ExpertizeFactory()
    
    response=client.get(f'/doctor/Expertize/{expertize.id}/')
    
    assert response.status_code == 200


    
##### DELETE #### 
@pytest.mark.django_db
def test_expertize_delete():
    account=AccountFactory(role=Role.ADMIN)
    user=account.user
    token=generate_access_token(user)
    
    client=APIClient()
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    expertize=ExpertizeFactory()
    response=client.delete(f'/doctor/Expertize/{expertize.id}/')

    assert response.status_code==204
    assert Expertize.objects.count() ==0   
    
@pytest.mark.django_db
def test_expertize_delete_not_admin():
    account=AccountFactory()
    user=account.user
    token=generate_access_token(user)
    
    client=APIClient()
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    expertize=ExpertizeFactory()
    response=client.delete(f'/doctor/Expertize/{expertize.id}/')

    assert response.status_code == 401
    assert Expertize.objects.count() == 1 
    
    
    
##### UPDATE ####
@pytest.mark.django_db
def test_expertize_update_with_jwt():
    account_admin=AccountFactory(role=Role.ADMIN)
    user=account_admin.user
    token=generate_access_token(user)
    
    client=APIClient()
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
    
    expertize=ExpertizeFactory()

    response=client.patch(f'/doctor/Expertize/{expertize.id}/',{'name':'newname'})

    assert response.status_code==200
    expertize.refresh_from_db()
    assert Expertize.objects.count() ==1
    assert response.data['name'] == 'newname'
    
@pytest.mark.django_db
def test_expertize_update_without_admin():
    account_not_admin=AccountFactory()
    
    user=account_not_admin.user
    token=generate_access_token(user)
    
    client=APIClient()
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
    
    expertize=ExpertizeFactory()

    response=client.patch(f'/doctor/Expertize/{expertize.id}/',{'name':'newname'})

    assert response.status_code==401

##### CREATE ####
@pytest.mark.django_db
def test_expertize_create_with_jwt_admin():
    client=APIClient()
    
    account_admin=AccountFactory(role=Role.ADMIN)
    user=account_admin.user
    token=generate_access_token(user)
 
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
  
    data={
        "name":"test",

        "description":'test'
    }
    response=client.post('/doctor/Expertize/',data)
    
    assert response.status_code ==201
    
    assert response.data["description"] == 'test'
    
    assert Expertize.objects.count() == 1

   
    
@pytest.mark.django_db
def test_expertize_create_without_admin():
    client=APIClient()
    
    account_not_admin=AccountFactory()
    user=account_not_admin.user
    token=generate_access_token(user)
 
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    data={
        "name":"test",
        "description":'test'
    }
    response=client.post('/doctor/Expertize/',data)
    
    assert response.status_code ==401
    assert Expertize.objects.count() == 0
