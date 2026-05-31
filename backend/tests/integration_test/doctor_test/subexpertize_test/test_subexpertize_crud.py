import pytest
from rest_framework.test import APIClient


from tests.utils import generate_access_token
from factories.factory_account import AccountFactory
from factories.factory_doctor import SubExpertizeFactory,ExpertizeFactory
from doctor_app.models import SubExpertize
from account_app.models import Role

##### GET ####
@pytest.mark.django_db
def test_list_subexpertizes():
    client=APIClient()
    SubExpertizeFactory.create_batch(4)
    
    response=client.get('/doctor/SubExpertize/')
    
    assert response.status_code == 200
    assert SubExpertize.objects.count() == 4


@pytest.mark.django_db
def test_retrieve_subexpertize():
    client=APIClient()
    
    expertize=ExpertizeFactory()
    subexpertize=SubExpertizeFactory(expertize_related=expertize)
    
    response=client.get(f'/doctor/SubExpertize/{subexpertize.id}/')
    
    assert response.status_code == 200

    assert response.data['expertize_related'] == expertize.id
    
##### DELETE #### 
@pytest.mark.django_db
def test_subexpertize_delete():
    account=AccountFactory(role=Role.ADMIN)
    user=account.user
    token=generate_access_token(user)
    
    client=APIClient()
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    subexpertize=SubExpertizeFactory()
    response=client.delete(f'/doctor/SubExpertize/{subexpertize.id}/')

    assert response.status_code==204
    assert SubExpertize.objects.count() ==0   
    
@pytest.mark.django_db
def test_subexpertize_delete_not_admin():
    account=AccountFactory()
    user=account.user
    token=generate_access_token(user)
    
    client=APIClient()
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    subexpertize=SubExpertizeFactory()
    response=client.delete(f'/doctor/SubExpertize/{subexpertize.id}/')

    assert response.status_code == 401
    assert SubExpertize.objects.count() == 1 
    
    
    
##### UPDATE ####
@pytest.mark.django_db
def test_subexpertize_update_with_jwt():
    account_admin=AccountFactory(role=Role.ADMIN)
    user=account_admin.user
    token=generate_access_token(user)
    
    client=APIClient()
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
    
    subexpertize=SubExpertizeFactory()

    response=client.patch(f'/doctor/SubExpertize/{subexpertize.id}/',{'name':'newname'})

    assert response.status_code==200
    subexpertize.refresh_from_db()
    assert SubExpertize.objects.count() ==1
    assert response.data['name'] == 'newname'
    
@pytest.mark.django_db
def test_subexpertize_update_without_admin():
    account_not_admin=AccountFactory()
    
    user=account_not_admin.user
    token=generate_access_token(user)
    
    client=APIClient()
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
    
    subexpertize=SubExpertizeFactory()

    response=client.patch(f'/doctor/SubExpertize/{subexpertize.id}/',{'name':'newname'})

    assert response.status_code==401

##### CREATE ####
@pytest.mark.django_db
def test_subexpertize_create_with_jwt_admin():
    client=APIClient()
    
    account_admin=AccountFactory(role=Role.ADMIN)
    user=account_admin.user
    token=generate_access_token(user)
 
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
    expertize=ExpertizeFactory()
    data={
        "expertize_related":expertize.id,
        "name":'test',
        "description":'test',
  
    }
    response=client.post('/doctor/SubExpertize/',data)
    
    assert response.status_code ==201
    
    assert response.data["description"] == 'test'
    
    assert SubExpertize.objects.count() == 1
    subexpertize = SubExpertize.objects.first()
    assert subexpertize.expertize_related.id == expertize.id
    
@pytest.mark.django_db
def test_subexpertize_create_without_admin():
    client=APIClient()
    
    account_not_admin=AccountFactory()
    user=account_not_admin.user
    token=generate_access_token(user)
 
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
    expertize=ExpertizeFactory()
    data={
        "expertize_related":expertize.id,
        "name":'test',
        "description":'test',
  
    }
    response=client.post('/doctor/SubExpertize/',data)
    
    assert response.status_code ==401
    assert SubExpertize.objects.count() == 0
