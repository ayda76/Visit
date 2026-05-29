import pytest
from factories.factory_schedule import (WorkDayFactory,
                                        WorkHourFactory)


@pytest.mark.django_db
class TestWorkDayModel:
    def test_workday_creation(self):
        workday=WorkDayFactory()
        assert workday.day is not None
        
    def test_workday_str(self):
        workday=WorkDayFactory()
        assert str(workday) == str(workday.id)
                
                
@pytest.mark.django_db
class TestWorkHourModel:
    def test_workday_creation(self):
        workhour=WorkHourFactory()
        assert workhour.id is not None
        
    def test_workday_str(self):
        workhour=WorkHourFactory()
        assert str(workhour) == str(workhour.id)
                