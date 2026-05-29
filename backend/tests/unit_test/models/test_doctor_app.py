import pytest
from factories.factory_doctor import (CenterFactory,
                                      ProviderFactory,
                                      ExpertizeFactory,
                                      SubExpertizeFactory,
                                      DoctorFactory,
                                      ProviderApplicationFactory,
                                      ProviderReviewFactory
                                      )


@pytest.mark.django_db
class TestCenterModel:
    def test_center_creation(self):
        center=CenterFactory()
        assert center.organizationID is not None
        
    def test_center_str(self):
        center=CenterFactory()
        assert str(center) == center.name
 
@pytest.mark.django_db
class TestProviderModel:
    def test_provider_creation(self):
        provider=ProviderFactory()
        assert provider.id is not None
        assert provider.is_active ==True
        
    def test_provider_str(self):
        provider=ProviderFactory()
        assert str(provider) == provider.name
        
@pytest.mark.django_db
class TestExpertizeModel:
    def test_expertize_creation(self):
        expertize=ExpertizeFactory()
        assert expertize.id is not None
        
    def test_expertize_str(self):
        expertize=ExpertizeFactory()
        assert str(expertize) == expertize.name
        
@pytest.mark.django_db
class TestSubExpertizeModel:
    def test_subexpertize_creation(self):
        subexpertize=SubExpertizeFactory()
        assert subexpertize.id is not None
        
    def test_subexpertize_str(self):
        subexpertize=SubExpertizeFactory()
        assert str(subexpertize) == subexpertize.name
        
        
@pytest.mark.django_db
class TesDoctorModel:
    def test_doctor_creation(self):
        doctor=DoctorFactory()
        assert doctor.email is not None
        
    def test_doctor_str(self):
        doctor=DoctorFactory()
        assert str(doctor) == str(doctor.id)
        
@pytest.mark.django_db
class TestProviderApplicationModel:
    def test_providerapplication_creation(self):
        providerapplication=ProviderApplicationFactory()
        assert providerapplication.id is not None
        
    def test_providerapplication_str(self):
        providerapplication=ProviderApplicationFactory()
        str_output=f"{providerapplication.account_related.lastname} - {providerapplication.role_requested}"
        assert str(providerapplication) == str_output
        
@pytest.mark.django_db
class TestProviderReviewModel:
    def test_providerreview_creation(self):
        providerreview=ProviderReviewFactory()
        assert providerreview.id is not None
        
    def test_providerreview_str(self):
        providerreview=ProviderReviewFactory()
        str_output=f"{providerreview.patient_related.lastname} review"
        assert str(providerreview) == str_output            