from rest_framework.routers import DefaultRouter
from book_app.api.views import *
from django.contrib import admin
from django.urls import path , include ,re_path

router = DefaultRouter()
router.register("Appointment", AppointmentViewSet)


urlpatterns = [

    path("", include(router.urls)),
  
    # path('ME/', AccountMeViewSet.as_view(), name='me'),

]
