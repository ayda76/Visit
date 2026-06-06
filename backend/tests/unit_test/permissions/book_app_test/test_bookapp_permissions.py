import pytest
from unittest.mock import MagicMock, patch
from book_app.permissions import Appointment_Permissions


@patch("book_app.permissions.Account.get_user_jwt")
def test_appointment_permission_logged_in(mock_get_user_jwt):

    mock_account = MagicMock()

    mock_get_user_jwt.return_value = mock_account
  
    permission = Appointment_Permissions()

    request = MagicMock()
    request.method = "POST"
  
    result = permission.has_permission(request,None)

    assert result is True
    
@patch("book_app.permissions.Account.get_user_jwt")
def test_appointment_permission_not_logged_in(mock_get_user_jwt):
    mock_get_user_jwt.return_value=None
    permission=Appointment_Permissions()
    
    request=MagicMock()
    request.method="POST"
    
    result=permission.has_permission(request,None)
    
    assert result ==False
    
    
def test_appointment_permisson_get_request():
    permission=Appointment_Permissions()
    
    request=MagicMock()
    request.method="GET"
    
    result=permission.has_permission(request,None)
    assert result == True
    
def test_appointment_permission_safe_method():
    permission=Appointment_Permissions()
    
    request=MagicMock()
    request.method="GET"
    obj = MagicMock()
    
    result=permission.has_object_permission(request,None,obj)
    
    assert result == True

@patch('book_app.permissions.Account.get_user_jwt')
def test_appointment_permission_with_Account(mock_get_user_jwt):
    Account=MagicMock()
    Account.id=1
    mock_get_user_jwt.return_value=Account
    permission=Appointment_Permissions()
    request=MagicMock()
    request.method="PUT"
    
    obj=MagicMock()
    obj.patient.id=1
    result=permission.has_object_permission(request,None,obj)
    
    assert result==True
    
@patch('book_app.permissions.Account.get_user_jwt')
def test_appointment_permission_without_Account(mock_get_user_jwt):
    Account=MagicMock()
    Account.id=1
    mock_get_user_jwt.return_value=Account
    permission=Appointment_Permissions()
    request=MagicMock()
    request.method="PATCH"
    
    obj=MagicMock()
    obj.patient.id=2
    result=permission.has_object_permission(request,None,obj)
    
    assert result==False
