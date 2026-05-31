import pytest

from rest_framework.test import APIClient




from django.contrib.auth.models import User
from account_app.models import Account

from factories.factory_account import AccountFactory
from tests.utils import generate_access_token

@pytest.mark.django_db
def test_password_change_success():

    client = APIClient()

    user = User.objects.create_user(
        username='testuser',
        password='OldPass123'
    )

    account = Account.objects.create(
        user=user
    )

    token = generate_access_token(user)

    client.credentials(
        HTTP_AUTHORIZATION=f"Bearer {token}"
    )

    response = client.post(
        '/account/change/password/',
        {
            "old_password": "OldPass123",
            "new_password1": "NewStrongPass123",
            "new_password2": "NewStrongPass123"
        }
    )

    assert response.status_code == 200

    user.refresh_from_db()

    assert user.check_password(
        "NewStrongPass123"
    )
    
@pytest.mark.django_db
def test_password_change_wrong_old_password():

    client = APIClient()

    user = User.objects.create_user(
        username='testuser',
        password='OldPass123'
    )

    account = Account.objects.create(
        user=user
    )

    token = generate_access_token(user)

    client.credentials(
        HTTP_AUTHORIZATION=f"Bearer {token}"
    )

    response = client.post(
        '/account/change/password/',
        {
            "old_password": "OldPass",
            "new_password1": "NewStrongPass123",
            "new_password2": "NewStrongPass123"
        }
    )

    assert response.status_code == 400

@pytest.mark.django_db
def test_password_change_password_mismatch():

    client = APIClient()

    user = User.objects.create_user(
        username='testuser',
        password='OldPass123'
    )

    account = Account.objects.create(
        user=user
    )

    token = generate_access_token(user)

    client.credentials(
        HTTP_AUTHORIZATION=f"Bearer {token}"
    )

    response = client.post(
        '/account/change/password/',
        {
            "old_password": "OldPass123",
            "new_password1": "NewStrongPass123",
            "new_password2": "NewStrongPass"
        }
    )

    assert response.status_code == 400
  
@pytest.mark.django_db 
def test_password_change_without_login():
    client = APIClient()

    user = User.objects.create_user(
        username='testuser',
        password='OldPass123'
    )

    account = Account.objects.create(
        user=user
    )


    response = client.post(
        '/account/change/password/',
        {
            "old_password": "OldPass123",
            "new_password1": "NewStrongPass123",
            "new_password2": "NewStrongPass"
        }
    )

    assert response.status_code == 401 