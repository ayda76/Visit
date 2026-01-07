from django.db import models
from account_app.models import Account
# Create your models here.


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
    
class DoctorDetail(models.Model):
    account_related        = models.ForeignKey(Account, on_delete=models.CASCADE, related_name="account_detail" )
    expertize_related      = models.ForeignKey(Expertize,on_delete=models.CASCADE, related_name="expertize_doctor" )
    subExpertize_relateds  = models.ManyToManyField(SubExpertize,related_name="subexpertize_doctor", null=True )
    degree                 = models.CharField(max_length=200, blank=True, null=True)
    address                = models.TextField( blank=True, null=True)
    organizationID         = models.CharField(max_length=200, blank=True, null=True)
    email                  = models.EmailField()
    phone1                 = models.DecimalField(blank=True , null=True, max_digits=11, decimal_places=0)
    phone2                 = models.DecimalField(blank=True , null=True, max_digits=11, decimal_places=0)
    link                   = models.CharField(max_length=200, blank=True, null=True)
    doctors_recommended    = models.ManyToManyField(Account, related_name="doctors_recommended" , null=True)
    
    def __str__(self) :
        return f"{str(self.id)}"