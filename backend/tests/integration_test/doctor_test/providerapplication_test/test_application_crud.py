import pytest
from rest_framework.test import APIClient
from django.core.files.uploadedfile import SimpleUploadedFile
from tests.utils import generate_access_token
from doctor_app.models import ProviderApplication
from account_app.models import Role
from factories.factory_account import AccountFactory
from factories.factory_doctor import ProviderApplicationFactory
                           

##### GET ####
@pytest.mark.django_db
def test_list_applications():
    client=APIClient()
    ProviderApplicationFactory.create_batch(4)
    
    response=client.get('/doctor/ProviderApplication/')
    
    assert response.status_code == 200
    assert ProviderApplication.objects.count() == 4


@pytest.mark.django_db
def test_retrieve_application():
    client=APIClient()
    account=AccountFactory()
    application=ProviderApplicationFactory(account_related=account)
    
    response=client.get(f'/doctor/ProviderApplication/{application.id}/')
    
    assert response.status_code == 200

    assert response.data['account_related'] == account.id
    
##### DELETE #### 
@pytest.mark.django_db
def test_application_delete_admin():
    account=AccountFactory(role=Role.ADMIN)
    user=account.user
    token=generate_access_token(user)
    
    client=APIClient()
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    application=ProviderApplicationFactory()
    response=client.delete(f'/doctor/ProviderApplication/{application.id}/')

    assert response.status_code==204
    assert ProviderApplication.objects.count() ==0   
 
@pytest.mark.django_db
def test_application_delete():
    account=AccountFactory(role=Role.CENTER_PENDING)
    user=account.user
    token=generate_access_token(user)
    
    client=APIClient()
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    application=ProviderApplicationFactory(account_related=account)
    response=client.delete(f'/doctor/ProviderApplication/{application.id}/')

    assert response.status_code==204
    assert ProviderApplication.objects.count() ==0      
    
@pytest.mark.django_db
def test_application_delete_not_login():

    
    client=APIClient()
    application=ProviderApplicationFactory()
    client.credentials(HTTP_AUTHORIZATION=f'Bearer xxx')
    response=client.delete(f'/doctor/ProviderApplication/{application.id}/')

    assert response.status_code == 401
    assert ProviderApplication.objects.count() == 1 
    
    
    
##### UPDATE ####

@pytest.mark.django_db
def test_application_update_with_jwt():
    account_center=AccountFactory(role=Role.CENTER_PENDING)
    user=account_center.user
    token=generate_access_token(user)
    
    client=APIClient()
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
    
    application=ProviderApplicationFactory(account_related=account_center)

    response=client.patch(f'/doctor/ProviderApplication/{application.id}/',{'role_requested':'center'})

    assert response.status_code==200
    application.refresh_from_db()
    assert ProviderApplication.objects.count() ==1
    assert application.role_requested == 'center'
        
@pytest.mark.django_db
def test_application_update_without_login():
 
    
    client=APIClient()
    application=ProviderApplicationFactory()

    response=client.patch(f'/doctor/ProviderApplication/{application.id}/',{'role_requested':'doctor'})

    assert response.status_code==401

##### CREATE ####

@pytest.mark.django_db
def test_application_create_with_jwt():
    client=APIClient()
    
    account_center=AccountFactory(role=Role.CENTER_PENDING)
    user=account_center.user
    token=generate_access_token(user)
 
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    data={
        "role_requested":'center',
        "documents": SimpleUploadedFile("avatar.jpg",b"file_content",content_type="image/jpeg")
    }
    response=client.post('/doctor/ProviderApplication/',data)
    
    assert response.status_code ==201
    print(f"dataaa:::{response.data}")
    assert ProviderApplication.objects.count() == 1
    application = ProviderApplication.objects.first()
    assert application.account_related.id == account_center.id
    
@pytest.mark.django_db
def test_application_create_without_account_login():
    client=APIClient()
    

    account=AccountFactory()
    data={
        "role_requested":'doctor',
        "account_related":account.id,
        "documents":SimpleUploadedFile(
            "avatar.jpg",
            b"file_content",
            content_type="image/jpeg"
        )
    }
    response=client.post('/doctor/ProviderApplication/',data)
    
    assert response.status_code ==401
    assert ProviderApplication.objects.count() == 0

