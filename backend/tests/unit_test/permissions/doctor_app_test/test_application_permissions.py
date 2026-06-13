import pytest
from unittest.mock import MagicMock, patch
from doctor_app.permissions import ProviderApplication_Permissions
from account_app.models import Role

@patch("doctor_app.permissions.Account.get_user_jwt")
def test_application_permission_post_authorized(mock_get_user_jwt):

    mock_account = MagicMock()
    mock_account.role=Role.ADMIN
    mock_get_user_jwt.return_value = mock_account
  
    permission = ProviderApplication_Permissions()

    request = MagicMock()
    request.method = "POST"
  
    result = permission.has_permission(request,None)

    assert result is True

@patch("doctor_app.permissions.Account.get_user_jwt")
def test_application_permission_not_authorized(mock_get_user_jwt):
    mock_account = MagicMock()
    mock_account.role=Role.PATIENT
    mock_get_user_jwt.return_value = mock_account
    
    permission=ProviderApplication_Permissions()
    
    request=MagicMock()
    request.method="POST"
    
    result=permission.has_permission(request,None)
    
    assert result ==False
 
@patch("doctor_app.permissions.Account.get_user_jwt")
def test_application_permission_post_not_logged_in(mock_get_user_jwt):
    mock_get_user_jwt.return_value=None
    permission=ProviderApplication_Permissions()
    
    request=MagicMock()
    request.method="POST"
    
    result=permission.has_permission(request,None)
    
    assert result ==False

@patch("doctor_app.permissions.Account.get_user_jwt")    
def test_application_permisson_get_login_admin(mock_get_user_jwt):
    mock_account = MagicMock()
    mock_account.role=Role.ADMIN
    mock_get_user_jwt.return_value = mock_account
    permission=ProviderApplication_Permissions()
    
    request=MagicMock()
    request.method="GET"
    
    result=permission.has_permission(request,None)
    assert result == True
    
@patch("doctor_app.permissions.Account.get_user_jwt")    
def test_application_permisson_get_not_login(mock_get_user_jwt):
    mock_get_user_jwt.return_value=None
    permission=ProviderApplication_Permissions()
    
    request=MagicMock()
    request.method="GET"
    
    result=permission.has_permission(request,None)
    assert result == False

@patch("doctor_app.permissions.Account.get_user_jwt")    
def test_application_permisson_get_not_admin(mock_get_user_jwt):
    mock_account = MagicMock()
    mock_account.role=Role.CENTER_PENDING
    mock_get_user_jwt.return_value = mock_account
    permission=ProviderApplication_Permissions()
    
    request=MagicMock()
    request.method="GET"
    
    result=permission.has_permission(request,None)
    assert result == False

@patch("doctor_app.permissions.Account.get_user_jwt") 
def test_application_permission_retrieve_authorized(mock_get_user_jwt):
    mock_account = MagicMock()
    mock_account.role=Role.DOCTOR_PENDING
    mock_account.id=1
    mock_get_user_jwt.return_value = mock_account
    permission=ProviderApplication_Permissions()
    
    request=MagicMock()
    request.method="GET"
    obj = MagicMock()
    obj.account_related=mock_account
    result=permission.has_object_permission(request,None,obj)
    
    assert result == True

@patch("doctor_app.permissions.Account.get_user_jwt") 
def test_application_permission_retrieve_not_authorized(mock_get_user_jwt):
    mock_account = MagicMock()
    mock_account.role=Role.DOCTOR_PENDING
    mock_account.id=1
    mock_get_user_jwt.return_value = mock_account
    permission=ProviderApplication_Permissions()
    
    request=MagicMock()
    request.method="GET"
    obj = MagicMock()
    account = MagicMock()
    account.id=3
    obj.account_related=account
    result=permission.has_object_permission(request,None,obj)
    
    assert result == False

@patch('doctor_app.permissions.Account.get_user_jwt')
def test_application_permission_put_with_admin(mock_get_user_jwt):
    account=MagicMock()
    account.id=1
    account.role=Role.ADMIN
    mock_get_user_jwt.return_value=account
    
    permission=ProviderApplication_Permissions()
    request=MagicMock()
    request.method="PUT"
    
    obj=MagicMock()
   
    result=permission.has_object_permission(request,None,obj)
    
    assert result==True
@patch('doctor_app.permissions.Account.get_user_jwt')
def test_application_permission_put_authorized(mock_get_user_jwt):
    mock_account = MagicMock()
    mock_account.role=Role.DOCTOR_PENDING
    mock_account.id=1
    mock_get_user_jwt.return_value = mock_account
    
    permission=ProviderApplication_Permissions()
    request=MagicMock()
    request.method="PUT"
    
    obj = MagicMock()
    obj.account_related=mock_account
   
    result=permission.has_object_permission(request,None,obj)
    
    assert result==True

@patch('doctor_app.permissions.Account.get_user_jwt')
def test_application_permission_put__not_authorized(mock_get_user_jwt):
    mock_account = MagicMock()
    mock_account.role=Role.DOCTOR_PENDING
    mock_account.id=1
    mock_get_user_jwt.return_value = mock_account
    
    permission=ProviderApplication_Permissions()
    request=MagicMock()
    request.method="PUT"
    
    obj = MagicMock()
    account = MagicMock()
    account.id=3
    obj.account_related=account
   
    result=permission.has_object_permission(request,None,obj)
    
    assert result==False
     
@patch('doctor_app.permissions.Account.get_user_jwt')
def test_application_permission_put_without_login(mock_get_user_jwt):

    mock_get_user_jwt.return_value=None
    
    permission=ProviderApplication_Permissions()
    request=MagicMock()
    request.method="PUT"
    
    obj=MagicMock()
   
    result=permission.has_object_permission(request,None,obj)
    
    assert result==False 
    

    
@patch('doctor_app.permissions.Account.get_user_jwt')
def test_application_permission_delete_with_admin(mock_get_user_jwt):
    account=MagicMock()
    account.role=Role.ADMIN
    mock_get_user_jwt.return_value=account
    permission=ProviderApplication_Permissions()
    request=MagicMock()
    request.method="DELETE"
    
    obj=MagicMock()
    result=permission.has_object_permission(request,None,obj)
    
    assert result==True

    
@patch('doctor_app.permissions.Account.get_user_jwt')
def test_application_permission_delete_authorized(mock_get_user_jwt):
    account=MagicMock()
    account.role=Role.CENTER_PENDING
    account.id=1
    mock_get_user_jwt.return_value=account
    permission=ProviderApplication_Permissions()
    request=MagicMock()
    request.method="DELETE"
    
    obj=MagicMock()
    obj.account_related=account
    result=permission.has_object_permission(request,None,obj)
    
    assert result==True
@patch('doctor_app.permissions.Account.get_user_jwt')
def test_application_permission_delete_not_authorized(mock_get_user_jwt):
    mock_account=MagicMock()
    mock_account.id=1
    mock_get_user_jwt.return_value=mock_account
    permission=ProviderApplication_Permissions()
    request=MagicMock()
    request.method="DELETE"
    
    obj=MagicMock()
    account = MagicMock()
    account.id=3
    obj.account_related=account
    result=permission.has_object_permission(request,None,obj)
    
    assert result==False

