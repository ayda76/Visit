import pytest
from rest_framework.test import APIClient
from unittest.mock import patch

from factories.factory_account import AccountFactory
from factories.factory_doctor import ProviderApplicationFactory
from account_app.models import Role
from tests.utils import generate_access_token
from doctor_app.models import Provider,Center,StatusApplication


@pytest.mark.django_db
@patch("doctor_app.api.views.send_acceptance_email")
def test_review_approve_doctorRole_by_admin(mock_send_acceptance_email):
    account_admin=AccountFactory(role=Role.ADMIN)
    user=account_admin.user
    token=generate_access_token(user)
    
    client=APIClient()
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}") 
    account_doctor=AccountFactory(role=Role.DOCTOR_PENDING)
    application=ProviderApplicationFactory(account_related=account_doctor)
    response = client.post(f"/doctor/ProviderApplication/{application.id}/review/",
                           {"decision":"approve"},format="json")
    
    assert response.status_code== 200
    assert response.data['is_approved'] == True
    assert Provider.objects.count() ==1
    provider=Provider.objects.first()
    account_doctor.refresh_from_db()
    assert provider.account_related.id==application.account_related.id
    assert account_doctor.role == Role.DOCTOR
    mock_send_acceptance_email.delay.assert_called_once_with( application.account_related.email,True)


@pytest.mark.django_db
@patch("doctor_app.api.views.send_acceptance_email")
def test_review_approve_centerRole_by_admin(mock_send_acceptance_email):
    account_admin=AccountFactory(role=Role.ADMIN)
    user=account_admin.user
    token=generate_access_token(user)
    
    client=APIClient()
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}") 
    account_center=AccountFactory(role=Role.CENTER_PENDING)
    application=ProviderApplicationFactory(account_related=account_center)
    response = client.post(f"/doctor/ProviderApplication/{application.id}/review/",
                           {"decision":"approve"},format="json")
    
    assert response.status_code== 200
    assert response.data['is_approved'] == True
    assert Center.objects.count() ==1
    assert Provider.objects.count() ==1
    provider=Provider.objects.first()
    account_center.refresh_from_db()
    assert provider.account_related.id==application.account_related.id
    assert account_center.role == Role.CENTER_MANAGER
    mock_send_acceptance_email.delay.assert_called_once_with( application.account_related.email,True)

@pytest.mark.django_db
@patch("doctor_app.api.views.send_acceptance_email")
def test_review_approve_otherRole_by_admin(mock_send_acceptance_email):
    account_admin=AccountFactory(role=Role.ADMIN)
    user=account_admin.user
    token=generate_access_token(user)
    
    client=APIClient()
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}") 
    account_other=AccountFactory(role=Role.DOCTOR)
    application=ProviderApplicationFactory(account_related=account_other)
    response = client.post(f"/doctor/ProviderApplication/{application.id}/review/",
                           {"decision":"approve"},format="json")
    
    assert response.status_code== 400
    application.refresh_from_db()
    assert application.is_approved == False
    assert Provider.objects.count() ==0
    mock_send_acceptance_email.delay.assert_not_called()

@pytest.mark.django_db
@patch("doctor_app.api.views.send_acceptance_email")
def test_review_rject_by_admin(mock_send_acceptance_email):
    account_admin=AccountFactory(role=Role.ADMIN)
    user=account_admin.user
    token=generate_access_token(user)
    
    client=APIClient()
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}") 

    application=ProviderApplicationFactory()
    response = client.post(f"/doctor/ProviderApplication/{application.id}/review/",
                           {"decision":"reject"},format="json")
    
    assert response.status_code== 200
    application.refresh_from_db()
    assert  application.status== StatusApplication.REJECTED
 
    assert Provider.objects.count() ==0
    mock_send_acceptance_email.delay.assert_called_once_with( application.account_related.email,False)

@pytest.mark.django_db
def test_review_not_admin():
    account_admin=AccountFactory(role=Role.PATIENT)
    user=account_admin.user
    token=generate_access_token(user)
    
    client=APIClient()
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}") 

    application=ProviderApplicationFactory()
    response = client.post(f"/doctor/ProviderApplication/{application.id}/review/",
                           {"decision":"reject"},format="json")
    
    assert response.status_code== 401
   
