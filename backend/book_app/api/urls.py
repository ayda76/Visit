from rest_framework.routers import DefaultRouter
from django.urls import path , include ,re_path
from book_app.api.views import AppointmentViewSet


router = DefaultRouter()
router.register("Appointment", AppointmentViewSet)


urlpatterns = [

    path("", include(router.urls)),
  
    # path('ME/', AccountMeViewSet.as_view(), name='me'),

]
#book/Appointment/
