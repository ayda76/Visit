import pytest
from unittest.mock import MagicMock, patch
from doctor_app.permissions import Admin_Permissions
from account_app.models import Role

@patch("doctor_app.permissions.Account.get_user_jwt")
def test_admin_permission_logged_in(mock_get_user_jwt):

    mock_account = MagicMock()
    mock_account.role=Role.ADMIN
    mock_get_user_jwt.return_value = mock_account
  
    permission = Admin_Permissions()

    request = MagicMock()
    request.method = "POST"
  
    result = permission.has_permission(request,None)

    assert result is True
    
@patch("doctor_app.permissions.Account.get_user_jwt")
def test_admin_permission_not_logged_in(mock_get_user_jwt):
    mock_get_user_jwt.return_value=None
    permission=Admin_Permissions()
    
    request=MagicMock()
    request.method="POST"
    
    result=permission.has_permission(request,None)
    
    assert result ==False
    
    
def test_everyone_permisson_get_request():
    permission=Admin_Permissions()
    
    request=MagicMock()
    request.method="GET"
    
    result=permission.has_permission(request,None)
    assert result == True
    
def test_everyone_permission_safe_method():
    permission=Admin_Permissions()
    
    request=MagicMock()
    request.method="GET"
    obj = MagicMock()
    
    result=permission.has_object_permission(request,None,obj)
    
    assert result == True

@patch('doctor_app.permissions.Account.get_user_jwt')
def test_admin_permission_put_with_admin(mock_get_user_jwt):
    account=MagicMock()
    account.id=1
    account.role=Role.ADMIN
    mock_get_user_jwt.return_value=account
    
    permission=Admin_Permissions()
    request=MagicMock()
    request.method="PUT"
    
    obj=MagicMock()
   
    result=permission.has_object_permission(request,None,obj)
    
    assert result==True
 
@patch('doctor_app.permissions.Account.get_user_jwt')
def test_admin_permission_put_without_login(mock_get_user_jwt):

    mock_get_user_jwt.return_value=None
    
    permission=Admin_Permissions()
    request=MagicMock()
    request.method="PUT"
    
    obj=MagicMock()
   
    result=permission.has_object_permission(request,None,obj)
    
    assert result==False 
    
@patch('doctor_app.permissions.Account.get_user_jwt')
def test_admin_permission_patch_not_admin(mock_get_user_jwt):
    account=MagicMock()

    account.role=Role.DOCTOR_PENDING
    mock_get_user_jwt.return_value=account
    permission=Admin_Permissions()
    request=MagicMock()
    request.method="PATCH"
    
    obj=MagicMock()
    result=permission.has_object_permission(request,None,obj)
    
    assert result==False
    
@patch('doctor_app.permissions.Account.get_user_jwt')
def test_admin_permission_delete(mock_get_user_jwt):
    account=MagicMock()
    account.role=Role.ADMIN
    mock_get_user_jwt.return_value=account
    permission=Admin_Permissions()
    request=MagicMock()
    request.method="DELETE"
    
    obj=MagicMock()
    result=permission.has_object_permission(request,None,obj)
    
    assert result==True

@patch('doctor_app.permissions.Account.get_user_jwt')
def test_admin_permission_delete_not_admin(mock_get_user_jwt):
    account=MagicMock()
    account.role=Role.DOCTOR
    mock_get_user_jwt.return_value=account
    permission=Admin_Permissions()
    request=MagicMock()
    request.method="DELETE"
    
    obj=MagicMock()
    result=permission.has_object_permission(request,None,obj)
    
    assert result==False



# 