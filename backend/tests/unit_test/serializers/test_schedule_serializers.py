
import pytest
from datetime import date, time
from schedule_app.api.serializers import WorkDaySerializer,WorkHourSerializer 
from schedule_app.models import WorkHour,WorkDay
from factories.factory_schedule import WorkDayFactory,WorkHourFactory
from factories.factory_doctor import ProviderFactory


@pytest.mark.django_db
class TestWorkDaySerializer:
    def test_create_workday(self):
        provider=ProviderFactory()
        data = {
            "day":WorkDay.Weekday.MONDAY,
            "provider_related": provider.id,
            "duration_min":10
        }
        serializer = WorkDaySerializer(data=data)

        assert serializer.is_valid(), serializer.errors

        workday = serializer.save()

        assert workday.id is not None
        assert isinstance(workday, WorkDay)
      
    def test_serializer_output(self):    
        workday=WorkDayFactory()
        serializer_data=WorkDaySerializer(workday).data
        
        assert serializer_data['duration_min'] is not None

        
    def test_partial_update(self):
        workday=WorkDayFactory()
        serializer=WorkDaySerializer(workday,data={'duration_min':20},partial=True)
        assert serializer.is_valid()
        updated_workday=serializer.save()
        assert updated_workday.duration_min == 20
   


@pytest.mark.django_db
class TestWorkHourSerializer:
    def test_create_workhour(self):
        workday=WorkDayFactory()
       
        data = {
            "workday_related":workday.id,
            'start_time':time(10,0),
            'end_time':time(10,30),
        }

        serializer = WorkHourSerializer(data=data)

        assert serializer.is_valid(), serializer.errors

        workhour = serializer.save()

        assert workhour.id is not None
        assert workhour.workday_related.id== workday.id  

    def test_serializer_output(self):    
        workhour=WorkHourFactory()
        serializer_data=WorkHourSerializer(workhour).data
        
        assert serializer_data['workday_related'] == workhour.workday_related.id
        
    def test_partial_update(self):
        workhour=WorkHourFactory()
        serializer=WorkHourSerializer(workhour,data={'start_time':time(9,0)},partial=True)
        assert serializer.is_valid()
        updated_workhour=serializer.save()
        assert updated_workhour.start_time == time(9,0)
        
    def test_invalid_partial_update(self):
        workhour=WorkHourFactory()
        serializer=WorkHourSerializer(workhour,data={'start_time':'xxx'},partial=True)
     
        assert not serializer.is_valid() 
        print(f"serializer errors:::{serializer.errors}")
 
    