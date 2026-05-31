import pytest
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.test import APIClient

from factories.factory_user import UserFactory
from factories.factory_account import AccountFactory

from django.contrib.auth.models import User
from account_app.models import Account




@pytest.mark.django_db
def test_register_success():

    client = APIClient()

    response = client.post(
        '/account/SignUp/',
        {
            "username": "testuser",
            "password": "StrongPass123",
            "password2": "StrongPass123"
        }
    )

    assert response.status_code == 201

    assert User.objects.count() == 1

    assert Account.objects.count() == 1

    assert "access" in response.data
    assert "refresh" in response.data
    


@pytest.mark.django_db
def test_register_duplicate_username():
    client = APIClient()
    
    user=UserFactory()
    
    response = client.post(
        '/account/SignUp/',
        {
            "username": user.username,
            "password": "StrongPass123",
            "password2": "StrongPass123"
        }
    )

    assert response.status_code == 400


@pytest.mark.django_db
def test_register_password_mismatch():
    client = APIClient()

    response = client.post(
        '/account/SignUp/',
        {
            "username": "testuser",
            "password": "StrongPass12345",
            "password2": "StrongPass123"
        }
    )

    assert response.status_code == 400

    assert User.objects.count() == 0

    assert Account.objects.count() == 0

    assert "access" not in response.data
    assert "refresh" not in response.data    


