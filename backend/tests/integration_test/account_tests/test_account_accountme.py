import pytest

from rest_framework.test import APIClient

from factories.factory_account import AccountFactory
from tests.utils import generate_access_token


@pytest.mark.django_db
def test_account_me_authenticated():

    client = APIClient()

    account = AccountFactory()

    token = generate_access_token(account.user)

    client.credentials(
        HTTP_AUTHORIZATION=f"Bearer {token}"
    )

    response = client.get(
        '/account/ME/'
    )

    assert response.status_code == 200

    assert response.data["id"] == account.id
    
@pytest.mark.django_db    
def test_account_me_without_login():

    client = APIClient()

    response = client.get(
        '/account/ME/'
    )

    assert response.status_code == 401

    