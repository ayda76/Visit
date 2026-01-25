from django.db import models
from account_app.models import Account
# Create your models here.

class Center(models.Model):
    name                   = models.CharField(max_length=200, blank=True, null=True)
    manager                = models.ForeignKey(Account,related_name='Center_manager_account',on_delete=models.CASCADE,)
    organizationID         = models.CharField(max_length=200, blank=True, null=True)
    phone1                 = models.DecimalField(blank=True , null=True, max_digits=11, decimal_places=0)
    phone2                 = models.DecimalField(blank=True , null=True, max_digits=11, decimal_places=0)
    link                   = models.CharField(max_length=200, blank=True, null=True)
    address                = models.TextField( blank=True, null=True)

    def __str__(self) :
        return self.name
    


class Provider(models.Model):

    name              = models.CharField(max_length=500, blank=True, null=True)
    Center_related    = models.ForeignKey(Center, on_delete=models.CASCADE, related_name="Center_provider",blank=True, null=True )
    is_active         = models.BooleanField(default=True)
    
    def __str__(self) :
        return self.name



class Expertize(models.Model):
    name                = models.CharField(max_length=200, blank=True, null=True)
    description         = models.TextField( blank=True, null=True)
    def __str__(self) :
        return self.name
    
class SubExpertize(models.Model):
    expertize_related   = models.ForeignKey(Expertize ,on_delete=models.CASCADE, related_name="expertize_sub")
    name                = models.CharField(max_length=200, blank=True, null=True)
    description         = models.TextField( blank=True, null=True)    
    def __str__(self) :
        return self.name
    
class Doctor(models.Model):
    provider_related       = models.OneToOneField(Provider,on_delete=models.CASCADE, related_name="provider_doctor",blank=True, null=True)
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
        return str(self.id)
    
    
