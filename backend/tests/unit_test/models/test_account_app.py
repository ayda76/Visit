import pytest
from rest_framework.test import APIRequestFactory
from factories.factory_account import AccountFactory
from rest_framework_simplejwt.tokens import RefreshToken
from tests.utils import get_tokens_for_user


@pytest.mark.django_db
class TestAccountModel:
    def test_account_creation(self):
        account=AccountFactory()
        assert account.id is not None
        
    def test_account_str(self):
        account=AccountFactory()
        str_output=f"{account.firstname or ''} {account.lastname or ''}".strip()
        assert str(account) == str_output
        
    def test_account_str_empty_names(self):

        account = AccountFactory(
            firstname="",
            lastname=""
        )

        assert str(account) == ""
        
    def test_get_user_jwt_valid_token(self):
        account=AccountFactory()
        token=get_tokens_for_user(account.user)
        factory = APIRequestFactory()

        request = factory.get(
            "/fake-url/",
            HTTP_AUTHORIZATION=f"Bearer {token}"
        )    
        
        result = account.get_user_jwt(request)
        
        assert result == account