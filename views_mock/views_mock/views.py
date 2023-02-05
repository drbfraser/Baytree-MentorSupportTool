from rest_framework.response import Response
from rest_framework.decorators import permission_classes, api_view

# from users.permissions import AdminPermissions, MentorPermissions
import json

from django.http import HttpResponse
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenObtainPairView,
    TokenVerifyView,
)
from rest_framework_simplejwt.serializers import (
    TokenVerifySerializer,
    TokenRefreshSerializer,
)
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.tokens import AccessToken

from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
from django.apps import apps
from django.db.models import ForeignKey

from datetime import datetime
from django.utils.timezone import make_aware

@api_view(("GET",))
@permission_classes((AllowAny,))
# def logout_view(request):
#     response = HttpResponse()
#     cookie_max_age = 0

#     response.set_cookie(
#         "refresh_token", "", max_age=cookie_max_age, httponly=True, samesite="Strict"
#     )

#     response.set_cookie(
#         "access_token", "", max_age=cookie_max_age, httponly=True, samesite="Strict"
#     )

#     response.status_code = 200

#     return response


class CookieTokenVerifySerializer(TokenVerifySerializer):
    token = None

    def validate(self, attrs):
        attrs["token"] = self.context["request"].COOKIES.get("access_token")
        if attrs["token"]:
            return super().validate(attrs)
        else:
            raise InvalidToken("No valid token found in cookie")


class CookieTokenVerifyView(TokenVerifyView):
    serializer_class = CookieTokenVerifySerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        access_token = request.COOKIES.get("access_token")
        access_token_obj = AccessToken(access_token)
        user_id = access_token_obj["user_id"]

        admin_user_model = apps.get_model("users", "AdminUser")
        is_admin = admin_user_model.objects.filter(pk=user_id).exists()

        user_model = apps.get_model("users", "CustomUser")
        user = user_model.objects.get(pk=user_id)

        is_superuser = user.is_superuser

        return Response(
            {"is_admin": is_admin, "is_superuser": is_superuser},
            status=status.HTTP_200_OK,
        )


class CookieTokenObtainPairView(TokenObtainPairView):

    def finalize_response(self, request, response, *args, **kwargs):
        # If wrong password, (unauthorized), don't return additional info or cookies
        if response.status_code == 401:
            # login-failures logging
            return super().finalize_response(request, response, *args, **kwargs)

        if request.data["email"]:
            replace_number = 4
            replace_str = "-"*replace_number + request.data["email"][replace_number:]

        if response.data.get("refresh"):
            cookie_max_age = 3600 * 24  # 1 day
            response.set_cookie(
                "refresh_token",
                response.data["refresh"],
                max_age=cookie_max_age,
                httponly=True,
                samesite="Strict",
            )
            del response.data["refresh"]
        if response.data.get("access"):
            cookie_max_age = 60 * 30  # 30 min
            response.set_cookie(
                "access_token",
                response.data["access"],
                max_age=cookie_max_age,
                httponly=True,
                samesite="Strict",
            )
            del response.data["access"]

        user_model = apps.get_model("users", "CustomUser")
        user = user_model.objects.get(email=request.data["email"])
        response.data["user_id"] = user.pk

        admin_user_model = apps.get_model("users", "AdminUser")
        response.data["is_admin"] = admin_user_model.objects.filter(pk=user.pk).exists()

        mentor_user_model = apps.get_model("users", "MentorUser")
        mentor_user_query_set = mentor_user_model.objects.filter(pk=user.pk)

        if mentor_user_query_set.exists():
            mentor_user = mentor_user_query_set.first()
            response.data["is_mentor"] = True
            try:
                response.data["viewsPersonId"] = int(mentor_user.viewsPersonId)
            except:
                pass
        else:
            response.data["is_mentor"] = False

        response.data["is_superuser"] = user.is_superuser

        # # login success logging
        # Flogging.sendInfoLog("login as admin") if user.is_superuser else Flogging.sendInfoLog("login as mentor")

        response.data["last_login"] = user.last_login
        user.last_login = make_aware(datetime.now())

        user.save()

        return super().finalize_response(request, response, *args, **kwargs)


class CookieTokenRefreshSerializer(TokenRefreshSerializer):
    refresh = None

    def validate(self, attrs):
        attrs["refresh"] = self.context["request"].COOKIES.get("refresh_token")
        if attrs["refresh"]:
            return super().validate(attrs)
        else:
            raise InvalidToken("No valid token found in cookie")


class CookieTokenRefreshView(TokenRefreshView):
    def finalize_response(self, request, response, *args, **kwargs):
        # If wrong password, (unauthorized), don't return additional info or cookies
        if response.status_code == 401:
            return super().finalize_response(request, response, *args, **kwargs)

        access_token_obj = None
        if response.data.get("refresh"):
            cookie_max_age = 3600 * 24  # 1 day
            response.set_cookie(
                "refresh_token",
                response.data["refresh"],
                max_age=cookie_max_age,
                httponly=True,
                samesite="Strict",
            )
            del response.data["refresh"]
        if response.data.get("access"):
            access_token_obj = AccessToken(response.data["access"])
            cookie_max_age = 60 * 30  # 30 min
            response.set_cookie(
                "access_token",
                response.data["access"],
                max_age=cookie_max_age,
                httponly=True,
                samesite="Strict",
            )
            del response.data["access"]

        if access_token_obj != None:
            user_id = access_token_obj["user_id"]

            admin_user_model = apps.get_model("users", "AdminUser")
            response.data["is_admin"] = admin_user_model.objects.filter(
                pk=user_id
            ).exists()

            user_model = apps.get_model("users", "CustomUser")
            user = user_model.objects.get(pk=user_id)

            response.data["is_superuser"] = user.is_superuser

        return super().finalize_response(request, response, *args, **kwargs)

    serializer_class = CookieTokenRefreshSerializer
