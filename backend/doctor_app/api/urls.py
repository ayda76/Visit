from rest_framework.routers import DefaultRouter
from django.urls import path , include ,re_path

from doctor_app.api.views import (CenterViewSet,
                                  ExpertizeViewSet,
                                  SubExpertizeViewSet,
                                  DoctorViewSet,
                                  ProviderViewSet,
                                  ProviderApplicationViewSet,
                                  ProviderReviewViewSet)


router = DefaultRouter()
router.register("Center", CenterViewSet)
router.register("Expertize", ExpertizeViewSet)
router.register("SubExpertize", SubExpertizeViewSet)
router.register("Doctor", DoctorViewSet)
router.register("Provider", ProviderViewSet)
router.register("ProviderApplication", ProviderApplicationViewSet)
router.register("ProviderReview", ProviderReviewViewSet)
# router.register("MedicalService", MedicalServiceViewSet)




urlpatterns = [

    path("", include(router.urls)),
  
    # path('ME/', AccountMeViewSet.as_view(), name='me'),

]

#/doctor/Center/
#/doctor/Expertize/
#/doctor/SubExpertize/
#/doctor/Doctor/
#/doctor/Provider/
#/doctor/ProviderApplication/
#/doctor/ProviderReview/
#/doctor/Provider/{id}/slots/
#/doctor/ProviderApplication/{id}/review/