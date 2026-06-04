from import_export import resources
from .models import (Center,
                     Expertize,
                     SubExpertize,
                     Doctor,
                     Provider,
                     ProviderApplication,
                     ProviderReview)


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
 
class ProviderApplicationResource(resources.ModelResource):
     class Meta:
          model= ProviderApplication

class ProviderReviewResource(resources.ModelResource):
     class Meta:
          model =ProviderReview 
   
