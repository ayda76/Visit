from rest_framework.routers import DefaultRouter
from django.contrib import admin
from django.urls import path , include ,re_path
from schedule_app.api.views import *

router = DefaultRouter()
router.register("WorkDay", WorkDayViewSet)
router.register("Schedule", ScheduleViewSet)



urlpatterns = [

    path("", include(router.urls)),
  
    # path('ME/', AccountMeViewSet.as_view(), name='me'),

]
