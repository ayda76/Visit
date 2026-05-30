
import pytest
from django.contrib.auth.models import User
from rest_framework.test import APIRequestFactory
from factories.factory_user import UserFactory
from factories.factory_account import AccountFactory
from account_app.api.serializers import (AccountSerializer,
                                         LoginSerializer,
                                         RegisterSerializer,
                                         PasswordChangeSerializer)

from account_app.models import (Account,
                                Role,
                                Status)

@pytest.mark.django_db
def test_register_user_successfully():
    
    data={
        'username':'testusername',
        'email':'test@test.com',
        'password':'TestPassword123!',
        'password2':'TestPassword123!'}

    serializer=RegisterSerializer(data=data)
    
    assert serializer.is_valid() 
    user=serializer.save()
    assert user.username == data["username"]
    
    assert User.objects.count() == 1
    assert Account.objects.count() == 1
    
    assert Account.objects.filter(user=user).exists()



@pytest.mark.django_db
def test_passwords_must_match():

    data={
        'username':'testusername',
        'email':'test@test.com',
        'password':'TestPassword123!',
        'password2':'123'}
    
    serializer=RegisterSerializer(data=data)
    
    assert not serializer.is_valid() 
    assert "password" in serializer.errors

@pytest.mark.django_db
def test_password_is_hashed():
    data={
        'username':'testusername',
        'email':'test@test.com',
        'password':'TestPassword123!',
        'password2':'TestPassword123!'}
    
    serializer=RegisterSerializer(data=data)
    
    assert serializer.is_valid() 
    user=serializer.save()
    
    assert user.password != "TestPassword123!"
    assert user.check_password("TestPassword123!")
    
@pytest.mark.django_db
def test_login_serializer_valid_data():

    serializer = LoginSerializer(
        data={
            "username": "ali",
            "password": "123456"
        }
    )

    assert serializer.is_valid()
    
@pytest.mark.django_db
def test_login_requires_username():
    serializer = LoginSerializer(data={"password":"123"})

    assert not serializer.is_valid()
    assert "username" in serializer.errors
    
@pytest.mark.django_db
def test_password_change_serializer_valid_data():

    serializer = PasswordChangeSerializer(
        data={
            "old_password": "old123",
            "new_password1": "new123",
            "new_password2": "new123"
        }
    )

    assert serializer.is_valid()
    
@pytest.mark.django_db
def test_password_change_requires_old_password():

    serializer = PasswordChangeSerializer(
        data={
            "new_password1": "new123",
            "new_password2": "new123"
        }
    )

    assert not serializer.is_valid()

    assert "old_password" in serializer.errors

@pytest.mark.django_db
class TestAccountSerializer:

    def test_user_can_have_only_one_account(self):
        user = UserFactory()
  
        account1=AccountFactory(user=user)
        
        data={
            'user':user.id,
            'firstname':'test',
            'email': 'test@gmail.com'}
        
        serializer = AccountSerializer(data=data)
        
        assert serializer.is_valid() is False
        assert "user" in serializer.errors   
        
    def test_account_serializer_output(self):
        account = AccountFactory()

        serializer = AccountSerializer(account)

        assert serializer.data["email"] == account.email
        assert serializer.data["id"] == account.id
                 
    def test_partial_update(self):
        account=AccountFactory()
        serializer=AccountSerializer(account,data={'email':'test@test.com'},partial=True)
        assert serializer.is_valid()
        updated_account=serializer.save()
        updated_account.refresh_from_db()
        assert updated_account.email == 'test@test.com'
        
    def test_invalid_partial_update(self):
        account=AccountFactory()
        serializer=AccountSerializer(account,data={'email':None},partial=True)
     
        assert  serializer.is_valid() == False
        assert "email" in serializer.errors
                  
    def test_create_patient_account_sets_active_status(self):
        user = UserFactory()
        
        data={
            'role':Role.PATIENT,
            'user':user.id,
            'firstname':'test',
            'email': 'test@gmail.com',
            'lastname':'test',
            'phone':'09126537847'
            }    
        serializer = AccountSerializer(data=data)
        assert serializer.is_valid()
        account=serializer.save()
        assert account.status == Status.ACTIVE
        

    def test_create_doctor_account_sets_pending_status(self):
        user = UserFactory()
        data={
            'role':Role.DOCTOR,
            'user':user.id,
            'firstname':'test',
            'email': 'test@gmail.com',
            'lastname':'test',
            'phone':'09126537847'
            }   
                    
          
      
        serializer = AccountSerializer(data=data)
        assert serializer.is_valid()
        account=serializer.save()
        assert account.status == Status.PENDING

