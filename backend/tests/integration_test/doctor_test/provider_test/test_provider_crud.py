import pytest
from rest_framework.test import APIClient

from tests.utils import generate_access_token
from doctor_app.models import Provider
from account_app.models import Role
from factories.factory_account import AccountFactory
from factories.factory_doctor import (
                                      ProviderFactory,
                                      CenterFactory,
                                      )


##### GET ####
@pytest.mark.django_db
def test_list_providers():
    client=APIClient()
    ProviderFactory.create_batch(4)
    
    response=client.get('/doctor/Provider/')
    
    assert response.status_code == 200
    assert Provider.objects.count() == 4


@pytest.mark.django_db
def test_retrieve_provider():
    client=APIClient()
    account=AccountFactory()
    provider=ProviderFactory(account_related=account)
    
    response=client.get(f'/doctor/Provider/{provider.id}/')
    
    assert response.status_code == 200

    assert response.data['account_related'] == account.id

  
##### DELETE #### 
@pytest.mark.django_db
def test_provider_delete():
    account=AccountFactory(role=Role.ADMIN)
    user=account.user
    token=generate_access_token(user)
    
    client=APIClient()
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    provider=ProviderFactory()
    response=client.delete(f'/doctor/Provider/{provider.id}/')

    assert response.status_code==204
    assert Provider.objects.count() ==0   
    
@pytest.mark.django_db
def test_provider_delete_not_admin():
    account=AccountFactory()
    user=account.user
    token=generate_access_token(user)
    
    client=APIClient()
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    provider=ProviderFactory()
    response=client.delete(f'/doctor/Provider/{provider.id}/')

    assert response.status_code == 401
    assert Provider.objects.count() == 1 
    

    
##### UPDATE ####
@pytest.mark.django_db
def test_provider_update_with_jwt():
    account_admin=AccountFactory(role=Role.ADMIN)
    user=account_admin.user
    token=generate_access_token(user)
    
    client=APIClient()
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
    
    provider=ProviderFactory()

    response=client.patch(f'/doctor/Provider/{provider.id}/',{'name':'new'})

    assert response.status_code==200
    provider.refresh_from_db()
    assert Provider.objects.count() ==1
    assert response.data['name'] == 'new'
    
@pytest.mark.django_db
def test_provider_update_without_admin():
    account_not_admin=AccountFactory()
    
    user=account_not_admin.user
    token=generate_access_token(user)
    
    client=APIClient()
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
    
    provider=ProviderFactory()

    response=client.patch(f'/doctor/Provider/{provider.id}/',{'name':'new'})

    assert response.status_code==401

##### CREATE ####
@pytest.mark.django_db
def test_provider_create_with_jwt_admin():
    client=APIClient()
    
    account_admin=AccountFactory(role=Role.ADMIN)
    user=account_admin.user
    token=generate_access_token(user)
 
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
    account=AccountFactory()
    center=CenterFactory()

    data={
        
        "name":"test",
        "account_related": account.id,
        "Center_related":center.id,
        "is_active":True
    }
 
    response=client.post('/doctor/Provider/',data)
    
    assert response.status_code ==201 , response.data
    
    assert Provider.objects.count() == 1
    provider = Provider.objects.first()
    assert provider.account_related.id == account.id
    
@pytest.mark.django_db
def test_provider_create_without_admin():
    client=APIClient()
    
    account_not_admin=AccountFactory()
    user=account_not_admin.user
    token=generate_access_token(user)
 
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
    account=AccountFactory()
    center=CenterFactory()

    data={
        
        "name":"test",
        "account_related": account.id,
        "Center_related":center.id,
        "is_active":True
    }
    response=client.post('/doctor/Provider/',data)
    
    assert response.status_code ==401
    assert Provider.objects.count() == 0
    
 
