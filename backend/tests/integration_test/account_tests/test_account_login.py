import pytest

from rest_framework.test import APIClient

from django.contrib.auth.models import User


@pytest.mark.django_db
def test_login_success():

    client = APIClient()

    user = User.objects.create_user(
        username='testuser',
        password='StrongPass123'
    )


    response = client.post('/account/Login/',{"username": "testuser","password": "StrongPass123"})
  
    assert response.status_code == 200

    assert "access" in response.data
 
@pytest.mark.django_db   
def test_login_wrong_password():
    client = APIClient()

    user = User.objects.create_user(
        username='testuser',
        password='StrongPass123'
    )

    response = client.post('/account/Login/',{"username": "testuser","password": "Strong"})

    assert response.status_code == 401

    assert "access" not in response.data
    
@pytest.mark.django_db       
def test_login_nonexistent_user():
    client = APIClient()

    response = client.post('/account/Login/',{"username": "testuser","password": "Strong"})

    assert response.status_code == 401

    assert "access" not in response.data    

@pytest.mark.django_db    
def test_login_missing_password():
    client = APIClient()
    user = User.objects.create_user(
        username='testuser',
        password='StrongPass123'
    )
    response = client.post('/account/Login/',{"username": "testuser","password": ""})

    assert response.status_code == 400

    assert "access" not in response.data    