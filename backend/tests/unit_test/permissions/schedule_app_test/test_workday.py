import pytest
from unittest.mock import MagicMock, patch
from schedule_app.permissions import (WorkDay_Permissions,WorkHour_Permissions)
from account_app.models import Role

@patch("schedule_app.permissions.Account.get_user_jwt")
def test_workday_permission_post_login_admin(mock_get_user_jwt):

    mock_account = MagicMock()
    mock_account.role=Role.ADMIN
    mock_get_user_jwt.return_value = mock_account
  
    permission = WorkDay_Permissions()

    request = MagicMock()
    request.method = "POST"
  
    result = permission.has_permission(request,None)

    assert result is True

@patch("schedule_app.permissions.Account.get_user_jwt")
def test_workday_permission_post_login_not_authorized(mock_get_user_jwt):

    mock_account = MagicMock()
    mock_account.role=Role.PATIENT
    mock_get_user_jwt.return_value = mock_account
  
    permission = WorkDay_Permissions()

    request = MagicMock()
    request.method = "POST"
  
    result = permission.has_permission(request,None)

    assert result is False
    
   
@patch("schedule_app.permissions.Account.get_user_jwt")
def test_workday_permission_post_method_not_logged_in(mock_get_user_jwt):
    mock_get_user_jwt.return_value=None
    permission=WorkDay_Permissions()
    
    request=MagicMock()
    request.method="POST"
    
    result=permission.has_permission(request,None)
    
    assert result ==False
    
    
def test_workday_permisson_get_request():
    permission=WorkDay_Permissions()
    
    request=MagicMock()
    request.method="GET"
    
    result=permission.has_permission(request,None)
    assert result == True
    
def test_workday_permission_safe_method():
    permission=WorkDay_Permissions()
    
    request=MagicMock()
    request.method="GET"
    obj = MagicMock()
    
    result=permission.has_object_permission(request,None,obj)
    
    assert result == True

@patch('schedule_app.permissions.Account.get_user_jwt')
def test_workday_permission_put_method_with_provider_account(mock_get_user_jwt):
    Account=MagicMock()
    Account.id=1
    Account.role=Role.DOCTOR
    mock_get_user_jwt.return_value=Account
    permission=WorkDay_Permissions()
    request=MagicMock()
    request.method="PUT"
    
    obj=MagicMock()
    obj.provider_related.account_related.id = Account.id    
    result=permission.has_object_permission(request,None,obj)
    
    assert result==True

@patch('schedule_app.permissions.Account.get_user_jwt')
def test_workday_permission_put_method_with_admin(mock_get_user_jwt):
    account=MagicMock()
    account.role=Role.ADMIN
    mock_get_user_jwt.return_value=account
    permission=WorkDay_Permissions()
    request=MagicMock()
    request.method="PUT"
    
    obj=MagicMock()
      
    result=permission.has_object_permission(request,None,obj)
    
    assert result==True
    
    
@patch('schedule_app.permissions.Account.get_user_jwt')
def test_workday_permission_put_method_without_login(mock_get_user_jwt):

    mock_get_user_jwt.return_value=None
    permission=WorkDay_Permissions()
    request=MagicMock()
    request.method="PATCH"
    
    obj=MagicMock()
    result=permission.has_object_permission(request,None,obj)
    
    assert result==False
