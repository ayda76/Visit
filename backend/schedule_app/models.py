from django.db import models
from doctor_app.models import Provider

class WorkDay(models.Model):
    class Weekday(models.IntegerChoices):
        MONDAY = 0, 'Monday'
        TUESDAY = 1, 'Tuesday'
        WEDNESDAY = 2, 'Wednesday'
        THURSDAY = 3, 'Thursday'
        FRIDAY = 4, 'Friday'
        SATURDAY = 5, 'Saturday'
        SUNDAY = 6, 'Sunday'

    day =models.PositiveSmallIntegerField(choices=Weekday.choices, default=0)
    provider_related =models.ForeignKey(Provider,on_delete=models.CASCADE,related_name='provider_workday',null=True)
    duration_min = models.PositiveIntegerField(default=10)
    is_active = models.BooleanField(default=True)
    def __str__(self) :
        return str(self.id)
 
class WorkHour(models.Model):
    workday_related=models.ForeignKey(WorkDay,on_delete=models.CASCADE,related_name='workhour_workday')
    start_time = models.TimeField()
    end_time = models.TimeField()
    def __str__(self) :
        return str(self.id)
       


    
