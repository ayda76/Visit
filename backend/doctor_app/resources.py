from import_export import resources
from .models import *


class CenterResource(resources.ModelResource):
     class Meta:
          model = Center
          
class ExpertizeResource(resources.ModelResource):
     class Meta:
          model = Expertize

class SubExpertizeResource(resources.ModelResource):
     class Meta:
          model = SubExpertize
          

class DoctorResource(resources.ModelResource):
     class Meta:
          model = Doctor

class ProviderResource(resources.ModelResource):
     class Meta:
          model = Provider
 

# class MedicalServiceResource(resources.ModelResource):
#      class Meta:
#           model = MedicalService 
   
