from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import CustomTokenObtainPairSerializer, UserRegisterSerializer,UserProfileSerializer

class RegisterView(APIView):
    permission_classes=[AllowAny]

    def post(self,request):
        serializer=UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            user=serializer.save()
            refresh=RefreshToken.for_user(user)
            return Response({
                "user":UserProfileSerializer(user).data,
                "access":str(refresh.access_token),
                "refresh":str(refresh),
            },status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class LoginView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class   = CustomTokenObtainPairSerializer

class ProfileView(APIView):
    permission_classes=[IsAuthenticated]

    def get(self,request):
        serializer=UserProfileSerializer(request.user)
        return Response(serializer.data)
    
    def patch(self,request):
        serializer=UserProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    