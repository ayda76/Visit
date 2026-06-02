import pytest
from rest_framework.test import APIClient
from unittest.mock import patch

from factories.factory_account import AccountFactory
from factories.factory_doctor import ProviderApplicationFactory
from account_app.models import Role
from tests.utils import generate_access_token
from doctor_app.models import Provider

#  ROLE_CHOICES    = (('doctor','doctor'),('center','center'))
# status          = models.CharField(max_length=20, choices=StatusApplication.choices, default=StatusApplication.PENDING)
# role_requested  = models.CharField(max_length=20, choices=ROLE_CHOICES)
# account_related = models.OneToOneField(Account,on_delete=models.CASCADE)
# documents       = models.FileField(upload_to='provider_documents/')
# is_approved     = models.BooleanField(default=False)
@pytest.mark.django_db
@patch("doctor_app.api.views.send_acceptance_email")
def test_review_approve_doctorRole_by_admin(mock_send_acceptance_email):
    account_admin=AccountFactory(role=Role.ADMIN)
    user=account_admin.user
    token=generate_access_token(user)
    
    client=APIClient()
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}") 
    account_doctor=AccountFactory(role=Role.DOCTOR_PENDING)
    application=ProviderApplicationFactory(account_related=account_doctor)
    response = client.post(f"/doctor/ProviderApplication/{application.id}/review/",
                           {"decision":"approve"},format="json")
    
    assert response.status_code== 200
    assert response.data['is_approved'] == True
    assert Provider.objects.count() ==1
    provider=Provider.objects.first()
    account_doctor.refresh_from_db()
    assert provider.account_related.id==application.account_related.id
    assert account_doctor.role == Role.DOCTOR
    mock_send_acceptance_email.delay.assert_called_once_with( application.account_related.email,True)




#test_review_approve_doctorRole_by_admin
#test_review_approve_centerRole_by_admin
#test_review_approve_otherRole_by_admin
#test_review_reject_by_admin
#test_review_not_admin

                # account_related.status=Status.ACTIVE
                # providerapplication_selected.status=StatusApplication.ACCEPTED
                # providerapplication_selected.is_approved=True 
                # if account_related.role==Role.DOCTOR_PENDING:
                #     provider = Provider.objects.create(account_related=account_related ,is_active=True)
                #     account_related.role=Role.DOCTOR
