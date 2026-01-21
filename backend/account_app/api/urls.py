from rest_framework.routers import DefaultRouter
from account_app.api.views import *
from django.contrib import admin
from django.urls import path , include ,re_path

router = DefaultRouter()
router.register("Account", AccountViewSet)

urlpatterns = [

    path("", include(router.urls)),
    path('change/password/', PasswordChangeView.as_view()),
    path('SignUp/', RegisterView.as_view(), name='signup'),
    path('Login/', LoginView.as_view(), name='login'),
    path('ME/', AccountMeViewSet.as_view(), name='me'),

]
