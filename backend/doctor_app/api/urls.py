from rest_framework.routers import DefaultRouter
from doctor_app.api.views import *
from django.contrib import admin
from django.urls import path , include ,re_path

router = DefaultRouter()
router.register("Center", CenterViewSet)
router.register("Expertize", ExpertizeViewSet)
router.register("SubExpertize", SubExpertizeViewSet)
router.register("Doctor", DoctorViewSet)
router.register("Provider", ProviderViewSet)
router.register("ProviderApplication", ProviderApplicationViewSet)
# router.register("MedicalService", MedicalServiceViewSet)




urlpatterns = [

    path("", include(router.urls)),
  
    # path('ME/', AccountMeViewSet.as_view(), name='me'),

]
