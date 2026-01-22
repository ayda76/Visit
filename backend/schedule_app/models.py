from django.db import models
from doctor_app.models import Provider

class WorkDay(models.Model):
    DAY_SELECT=(('sunday','sunday'),('monday','monday'),('tuesday','tuesday'),('wednesday','wednesday'),('thursday','thursday'),('friday','friday'),('saturday','saturday'))
    day=models.CharField(max_length=200, choices=DAY_SELECT,blank=True, null=True)
    visit_num=models.PositiveIntegerField(default=2)
    start_hour=models.TimeField()
    end_hour=models.TimeField()
    def __str__(self) :
        return str(self.id)
    


    

class Schedule(models.Model):
    provider_related=models.ForeignKey(Provider,on_delete=models.CASCADE,related_name='provider_schedule')
    working_days=models.ManyToManyField(WorkDay)
    def __str__(self) :
        return str(self.id)    