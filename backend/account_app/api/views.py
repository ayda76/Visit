from rest_framework import generics, viewsets
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework import status

from rest_framework import generics
from django.db.models import Q
from django.contrib.auth.forms import PasswordChangeForm
from rest_framework.views import APIView
from drf_yasg.utils import swagger_auto_schema 

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import action

from account_app.api.serializers import *
from account_app.models import *
# Helper function to generate JWT token
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class RegisterView(APIView):
    my_tags = ["Account"]
    @swagger_auto_schema(request_body=RegisterSerializer)
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            tokens = get_tokens_for_user(user)  # Generate JWT tokens for user
            Account.objects.get_or_create(user=user)  # create Account
            return Response(tokens, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    my_tags = ["Account"]
    @swagger_auto_schema(request_body=LoginSerializer)
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = authenticate(
                username=serializer.validated_data['username'],
                password=serializer.validated_data['password']
            )
            if user:
                tokens = get_tokens_for_user(user)  
                return Response(tokens, status=status.HTTP_200_OK)
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)                                  
                                  
                                  
class AccountViewSet(viewsets.ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    pagination_class=None
    my_tags = ["Account"]
    
    

class AccountMeViewSet(generics.ListAPIView):
    
    my_tags = ["Account"]
    serializer_class = AccountSerializer
    pagination_class=None
    
    def get(self,request):
        
        accountSelected = Account.get_user_jwt( self,request )
        serializer = AccountSerializer(accountSelected)
        return Response(serializer.data)
        
class PasswordChangeView(APIView):
    my_tags = ["Account"]

    @swagger_auto_schema(
        request_body=PasswordChangeSerializer,
        responses={
            200: "Password changed successfully",
            400: "Bad Request",
           
        },
    )
    def post(self, request):
        serializer = PasswordChangeSerializer(data=request.data)
        if serializer.is_valid():
            userSelecte = Account.get_user_jwt(self , request).user
            # Validate old and new passwords using Django's PasswordChangeForm
            form = PasswordChangeForm(userSelecte, serializer.validated_data)
            if form.is_valid():
                # Save the new password
                form.save()
                return Response({'success': 'Password changed successfully'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': form.errors}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        


       
