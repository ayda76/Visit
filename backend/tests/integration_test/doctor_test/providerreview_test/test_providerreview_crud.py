import pytest
from rest_framework.test import APIClient

from unittest.mock import patch
from datetime import date, time

from tests.utils import generate_access_token
from factories.factory_account import AccountFactory
from factories.factory_doctor import ProviderFactory,ProviderReviewFactory
from doctor_app.models import ProviderReview
from account_app.models import Role


##### GET ####
@pytest.mark.django_db
def test_list_reviews():
    client=APIClient()
    ProviderReviewFactory.create_batch(4)
    
    response=client.get('/doctor/ProviderReview/')
    
    assert response.status_code == 200
    assert ProviderReview.objects.count() == 4


@pytest.mark.django_db
def test_retrieve_review():
    client=APIClient()
    account=AccountFactory()
    review=ProviderReviewFactory(patient_related=account)
    
    response=client.get(f'/doctor/ProviderReview/{review.id}/')
    
    assert response.status_code == 200

    assert response.data['patient_related'] == account.id
    
##### DELETE #### 
@pytest.mark.django_db
def test_review_delete():
    account=AccountFactory(role=Role.ADMIN)
    user=account.user
    token=generate_access_token(user)
    
    client=APIClient()
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    review=ProviderReviewFactory()
    response=client.delete(f'/doctor/ProviderReview/{review.id}/')

    assert response.status_code==204
    assert ProviderReview.objects.count() ==0   
 
@pytest.mark.django_db
def test_review_delete():
    account=AccountFactory(role=Role.PATIENT)
    user=account.user
    token=generate_access_token(user)
    
    client=APIClient()
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    review=ProviderReviewFactory(patient_related=account)
    response=client.delete(f'/doctor/ProviderReview/{review.id}/')

    assert response.status_code==204
    assert ProviderReview.objects.count() ==0      
    
@pytest.mark.django_db
def test_review_delete_not_admin_or_patient():
    account=AccountFactory()
    user=account.user
    token=generate_access_token(user)
    
    client=APIClient()
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
    account_patient=AccountFactory()
    review=ProviderReviewFactory(patient_related=account_patient)
    response=client.delete(f'/doctor/ProviderReview/{review.id}/')

    assert response.status_code == 401
    assert ProviderReview.objects.count() == 1 
    
    
    
##### UPDATE ####
@pytest.mark.django_db
def test_review_update_with_admin():
    account_admin=AccountFactory(role=Role.ADMIN)
    user=account_admin.user
    token=generate_access_token(user)
    
    client=APIClient()
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
    
    review=ProviderReviewFactory()

    response=client.patch(f'/doctor/ProviderReview/{review.id}/',{'rating':2})

    assert response.status_code==200
    review.refresh_from_db()
    assert ProviderReview.objects.count() ==1
    assert response.data['rating'] == 2

@pytest.mark.django_db
def test_review_update_with_patient():
    account_patient=AccountFactory(role=Role.PATIENT)
    user=account_patient.user
    token=generate_access_token(user)
    
    client=APIClient()
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
    
    review=ProviderReviewFactory(patient_related=account_patient)

    response=client.patch(f'/doctor/ProviderReview/{review.id}/',{'rating':2})

    assert response.status_code==200
    review.refresh_from_db()
    assert ProviderReview.objects.count() ==1
    assert response.data['rating'] == 2
        
@pytest.mark.django_db
def test_review_update_without_admin_or_patient():
    account_not_admin=AccountFactory()
    
    user=account_not_admin.user
    token=generate_access_token(user)
    
    client=APIClient()
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
    
    account_patient=AccountFactory(role=Role.PATIENT)
    review=ProviderReviewFactory(patient_related=account_patient)

    response=client.patch(f'/doctor/ProviderReview/{review.id}/',{'rating':2})

    assert response.status_code==401

##### CREATE ####

@pytest.mark.django_db
def test_review_create_with_jwt_patient():
    client=APIClient()
    
    account_patient=AccountFactory(role=Role.PATIENT)
    user=account_patient.user
    token=generate_access_token(user)
 
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
   
    provider=ProviderFactory()
    data={
        "provider_related":provider.id,
        "rating":3,
        "comment":"not bad"
    }
    response=client.post('/doctor/ProviderReview/',data)
    
    assert response.status_code ==201
    
    assert ProviderReview.objects.count() == 1
    review = ProviderReview.objects.first()
    assert review.patient_related.id == account_patient.id
    
    
@pytest.mark.django_db
def test_review_create_with_jwt_admin():
    client=APIClient()
    
    account_admin=AccountFactory(role=Role.ADMIN)
    user=account_admin.user
    token=generate_access_token(user)
 
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
    account=AccountFactory()
    provider=ProviderFactory()
    data={
        "patient_related":account.id,
        "provider_related":provider.id,
        "rating":3,
        "comment":"not bad"
    }
    response=client.post('/doctor/ProviderReview/',data)
    
    assert response.status_code ==201

    assert ProviderReview.objects.count() == 1
    review = ProviderReview.objects.first()
    assert review.provider_related.id == provider.id
    
@pytest.mark.django_db
def test_review_create_without_admin_or_patient():
    client=APIClient()
    
    account_doctor=AccountFactory(role=Role.DOCTOR)
    user=account_doctor.user
    token=generate_access_token(user)
 
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    provider=ProviderFactory()
    data={
        "provider_related":provider.id,
        "rating":3,
        "comment":"not bad"
    }
    response=client.post('/doctor/ProviderReview/',data)
    
    assert response.status_code ==401
    assert ProviderReview.objects.count() == 0
