from django.db import models
from account_app.models import Account
# Create your models here.

class Service(models.Model):
    name                   = models.CharField(max_length=200, blank=True, null=True)
    manager                = models.ForeignKey(Account,related_name='service_manager_account',on_delete=models.CASCADE,)
    organizationID         = models.CharField(max_length=200, blank=True, null=True)
    phone1                 = models.DecimalField(blank=True , null=True, max_digits=11, decimal_places=0)
    phone2                 = models.DecimalField(blank=True , null=True, max_digits=11, decimal_places=0)
    link                   = models.CharField(max_length=200, blank=True, null=True)
    address                = models.TextField( blank=True, null=True)
    providers_recommended  = models.ManyToManyField('Provider', null=True)
    def __str__(self) :
        return f"{self.name}"

class Expertize(models.Model):
    name                = models.CharField(max_length=200, blank=True, null=True)
    description         = models.TextField( blank=True, null=True)
    def __str__(self) :
        return f"{self.name}"
    
class SubExpertize(models.Model):
    expertize_related   = models.ForeignKey(Expertize ,on_delete=models.CASCADE, related_name="expertize_sub")
    name                = models.CharField(max_length=200, blank=True, null=True)
    description         = models.TextField( blank=True, null=True)    
    def __str__(self) :
        return f"{self.name}"
    
class Doctor(models.Model):
    account_related        = models.ForeignKey(Account, on_delete=models.CASCADE, related_name="account_doctor" )
    expertize_related      = models.ForeignKey(Expertize,on_delete=models.CASCADE, related_name="expertize_doctor" )
    subExpertize_relateds  = models.ManyToManyField(SubExpertize,related_name="subexpertize_doctor", null=True )
    degree                 = models.CharField(max_length=200, blank=True, null=True)
    address                = models.TextField( blank=True, null=True)
    organizationID         = models.CharField(max_length=200, blank=True, null=True)
    email                  = models.EmailField()
    phone1                 = models.DecimalField(blank=True , null=True, max_digits=11, decimal_places=0)
    phone2                 = models.DecimalField(blank=True , null=True, max_digits=11, decimal_places=0)
    link                   = models.CharField(max_length=200, blank=True, null=True)
    providers_recommended  = models.ManyToManyField('Provider', related_name="providers_recommended" , null=True)
    
    def __str__(self) :
        return f"{str(self.id)}"
    
    
class Provider(models.Model):
    TYPE_SELECT        = (('doctor','doctor'),('service','service'))
    type_provider      = models.CharField(max_length=200,default='doctor',choices=TYPE_SELECT  , blank=True, null=True)
    doctor_related     = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name="doctor_provider",blank=True, null=True )
    service_related    = models.ForeignKey(Service, on_delete=models.CASCADE, related_name="service_provider",blank=True, null=True )
    
    def __str__(self) :
        return f"{self.type_provider}"