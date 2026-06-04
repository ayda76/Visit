from rest_framework.routers import DefaultRouter
from django.urls import path , include ,re_path
from account_app.api.views import (AccountViewSet,
                                   PasswordChangeView,
                                   RegisterView,
                                   LoginView,
                                   AccountMeViewSet)


router = DefaultRouter()
router.register("Account", AccountViewSet)

urlpatterns = [

    path("", include(router.urls)),
    path('change/password/', PasswordChangeView.as_view()),
    path('SignUp/', RegisterView.as_view(), name='signup'),
    path('Login/', LoginView.as_view(), name='login'),
    path('ME/', AccountMeViewSet.as_view(), name='me'),

]
