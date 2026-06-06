import pytest
from rest_framework.test import APIClient

from unittest.mock import patch
from datetime import date, time

from tests.utils import generate_access_token
from factories.factory_account import AccountFactory
from factories.factory_doctor import CenterFactory
from doctor_app.models import Center
from account_app.models import Role

##### GET ####
@pytest.mark.django_db
def test_list_centers():
    client=APIClient()
    CenterFactory.create_batch(4)
    
    response=client.get('/doctor/Center/')
    
    assert response.status_code == 200
    assert Center.objects.count() == 4





@pytest.mark.django_db
def test_retrieve_center():
    client=APIClient()
    account=AccountFactory()
    center=CenterFactory(manager=account)
    
    response=client.get(f'/doctor/Center/{center.id}/')
    
    assert response.status_code == 200

    assert response.data['manager'] == account.id
    
##### DELETE #### 
@pytest.mark.django_db
def test_center_delete():
    account=AccountFactory(role=Role.ADMIN)
    user=account.user
    token=generate_access_token(user)
    
    client=APIClient()
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    center=CenterFactory()
    response=client.delete(f'/doctor/Center/{center.id}/')

    assert response.status_code==204
    assert Center.objects.count() ==0   
    
@pytest.mark.django_db
def test_center_delete_not_admin():
    account=AccountFactory()
    user=account.user
    token=generate_access_token(user)
    
    client=APIClient()
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    center=CenterFactory()
    response=client.delete(f'/doctor/Center/{center.id}/')

    assert response.status_code == 401
    assert Center.objects.count() == 1 
    
    
    
##### UPDATE ####
@pytest.mark.django_db
def test_center_update_with_jwt():
    account_admin=AccountFactory(role=Role.ADMIN)
    user=account_admin.user
    token=generate_access_token(user)
    
    client=APIClient()
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
    
    center=CenterFactory()

    response=client.patch(f'/doctor/Center/{center.id}/',{'name':'newname'})

    assert response.status_code==200
    center.refresh_from_db()
    assert Center.objects.count() ==1
    assert response.data['name'] == 'newname'
    
@pytest.mark.django_db
def test_center_update_without_admin():
    account_not_admin=AccountFactory()
    
    user=account_not_admin.user
    token=generate_access_token(user)
    
    client=APIClient()
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
    
    center=CenterFactory()

    response=client.patch(f'/doctor/Center/{center.id}/',{'name':'newname'})

    assert response.status_code==401

##### CREATE ####
@pytest.mark.django_db
def test_center_create_with_jwt_admin():
    client=APIClient()
    
    account_admin=AccountFactory(role=Role.ADMIN)
    user=account_admin.user
    token=generate_access_token(user)
 
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
    account=AccountFactory()
    data={
        "name":"test",
        "manager":account.id,
        "organizationID":'cxfdrteyur',
        "phone1":'09126575435'
    }
    response=client.post('/doctor/Center/',data)
    
    assert response.status_code ==201
    
    assert response.data["organizationID"] == 'cxfdrteyur'
    
    assert Center.objects.count() == 1
    center = Center.objects.first()
    assert center.manager.id == account.id
    
@pytest.mark.django_db
def test_center_create_without_admin():
    client=APIClient()
    
    account_not_admin=AccountFactory()
    user=account_not_admin.user
    token=generate_access_token(user)
 
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
    account=AccountFactory()
    data={
        "name":"test",
        "manager":account.id,
        "organizationID":'cxfdrteyur',
        "phone1":'09126575435'
    }
    response=client.post('/doctor/Center/',data)
    
    assert response.status_code ==401
    assert Center.objects.count() == 0
