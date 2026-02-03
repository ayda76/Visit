from django.db import models
from doctor_app.models import Provider
from account_app.models import *
# Create your models here.

class Appointment(models.Model):
    class Weekday(models.IntegerChoices):
        MONDAY = 0, 'Monday'
        TUESDAY = 1, 'Tuesday'
        WEDNESDAY = 2, 'Wednesday'
        THURSDAY = 3, 'Thursday'
        FRIDAY = 4, 'Friday'
        SATURDAY = 5, 'Saturday'
        SUNDAY = 6, 'Sunday'

    weekday           = models.PositiveSmallIntegerField(choices=Weekday.choices, default=0)
    date              = models.DateField()
    start_time        = models.TimeField()
    end_time          = models.TimeField()
    provider_related  = models.ForeignKey(Provider,related_name='provider_appointment',on_delete=models.CASCADE,blank=True, null=True)
    patient           = models.ForeignKey(Account,related_name='patient_appointment',on_delete=models.CASCADE,blank=True, null=True)
    is_canceled       = models.BooleanField(default=False)
    
    created_at        = models.DateTimeField(auto_now_add=True)
    updated_at        = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ("provider_related", "date", "start_time", "end_time")

    
    def __str__(self) :
        return str(self.id)