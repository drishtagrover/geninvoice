from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token= super().get_token(user)
        token["email"]=user.email
        token["first_name"]=user.first_name
        token["last_name"]=user.last_name
        token["is_staff"]=user.is_staff
        return token;

class UserRegisterSerializer(serializers.ModelSerializer):
    password=serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model=User
        fields=["email","password","first_name","last_name"]

    def create(self,validated_data):
        return User.objects.create_user(**validated_data)

class UserProfileSerializer(serializers.ModelSerializer):
        full_name=serializers.CharField(read_only=True)

        class Meta:
             model=User
             fields=["id","email","first_name","last_name","full_name","photo_url",
                     "created_at"]
             read_only_fields = ["id","email","created_at"]
    