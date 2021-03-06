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

from xmlrpc.client import DateTime
from datetime import date, datetime
from django.utils.timezone import make_aware


@api_view(("GET",))
@permission_classes((AllowAny,))
def logout_view(request):
    response = HttpResponse()
    cookie_max_age = 0

    response.set_cookie(
        "refresh_token", "", max_age=cookie_max_age, httponly=True, samesite="Strict"
    )

    response.set_cookie(
        "access_token", "", max_age=cookie_max_age, httponly=True, samesite="Strict"
    )

    response.status_code = 200

    return response


def create_object(object_dict, model):
    object = object_dict
    create_args = {}

    for key, val in object.items():
        field = model._meta.get_field(key)
        if (
            field.many_to_many != True
            and field.one_to_one != True
            and isinstance(field, ForeignKey) == False
        ):
            create_args[key] = val
        elif field.one_to_one == True or isinstance(field, ForeignKey) == True:
            create_args[key + "_id"] = val

    created_obj = model().__class__.objects.create(**create_args)

    for key, val in object.items():  # many to many fields
        if model._meta.get_field(key).many_to_many == True:
            app_and_model = (
                model._meta.get_field(key)
                .target_field.cached_col.identity[1][1]
                .split("_")
            )
            foreign_model = apps.get_model(app_and_model[0], app_and_model[1])
            for object_id in val:
                foreign_object = foreign_model.objects.get(pk=object_id)
                getattr(created_obj, key).add(foreign_object)

    return created_obj.pk


def update_object(object, object_dict, model):
    update_args = {}

    for key, val in object_dict.items():
        if key == "id":
            continue

        field = model._meta.get_field(key)
        if (
            field.many_to_many != True
            and field.one_to_one != True
            and isinstance(field, ForeignKey) == False
        ):
            update_args[key] = val
        elif field.one_to_one == True or isinstance(field, ForeignKey) == True:
            update_args[key + "_id"] = val

    object.__dict__.update(**update_args)
    object.save()

    for key, val in object_dict.items():  # many to many fields
        if key == "id":
            continue

        if model._meta.get_field(key).many_to_many == True:
            getattr(object, key).clear()
            app_and_model = (
                model._meta.get_field(key)
                .target_field.cached_col.identity[1][1]
                .split("_")
            )
            foreign_model = apps.get_model(app_and_model[0], app_and_model[1])
            for object_id in val:
                foreign_object = foreign_model.objects.get(pk=object_id)
                getattr(object, key).add(foreign_object)

    return object.pk


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
            return super().finalize_response(request, response, *args, **kwargs)

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


class GenerateCrudEndpointsForModel(APIView):
    permission_classes = None
    serializer = None
    model = None
    get_override_func = None
    post_override_func = None
    delete_override_func = None
    put_override_func = None

    def get(self, request):
        if self.get_override_func:
            return self.get_override_func(self, request)

        if "id" not in request.GET:
            limit = None
            if "limit" in request.GET:
                limit = int(request.GET.get("limit", None))

            offset = None
            if "offset" in request.GET:
                offset = int(request.GET.get("offset", None))

            if limit != None:
                if offset == None:
                    offset = 0
                modelObjects = self.model.objects.all()[offset : offset + limit]
            else:
                modelObjects = self.model.objects.all()

            numModelObjects = self.model.objects.all().count()

            serialized = [
                self.serializer(modelObject).data for modelObject in modelObjects
            ]

            return Response(
                {"total": numModelObjects, "data": serialized},
                status=status.HTTP_200_OK,
            )
        else:
            ids = request.GET.getlist("id", "")
            if not isinstance(ids, list):
                ids = [ids]

            objects = []

            for id in ids:
                modelObject = self.model.objects.get(pk=id)
                serializer = self.serializer(modelObject)
                objects.append(serializer.data)

            numModelObjects = self.model.objects.all().count()

            return Response(
                {"total": numModelObjects, "data": objects}, status=status.HTTP_200_OK
            )

    def delete(self, request):
        if self.delete_override_func:
            return self.delete_override_func(self, request)

        ids = request.GET.getlist("id", "")
        if ids != None:
            try:
                if not isinstance(ids, list):
                    ids = [ids]
                self.model.objects.filter(pk__in=ids).delete()
                return Response(
                    {"status": "Successfully deleted object(s)."},
                    status=status.HTTP_200_OK,
                )
            except Exception as e:
                return Response(
                    {"error": "Failed to delete object"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        else:
            return Response(
                {"error": "No id was given"}, status=status.HTTP_400_BAD_REQUEST
            )

    def post(self, request):
        if self.post_override_func:
            return self.post_override_func(self, request)

        try:
            ids = []
            if "array" in request.data:
                for object in request.data["array"]:
                    if "id" in object:
                        del object["id"]

                    ids.append(create_object(object, self.model))

                return Response({"ids": ids}, status=status.HTTP_200_OK)
            else:
                object = request.data

                if "id" in object:
                    del object["id"]

                ids.append(create_object(request.data, self.model))

                return Response({"ids": ids}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": "Failed to create object"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def put(self, request):
        if self.put_override_func:
            return self.put_override_func(self, request)

        try:
            if "array" in request.data:
                for object in request.data["array"]:
                    update_object(
                        self.model.objects.get(pk=object["id"]), object, self.model
                    )
                return Response(
                    {"success": "Successfully updated objects"},
                    status=status.HTTP_200_OK,
                )
            else:
                object = request.data
                existing_object = self.model.objects.filter(pk=object["id"])
                if not existing_object.exists():
                    return Response(
                        {"error": "Failed to update object"},
                        status=status.HTTP_404_NOT_FOUND,
                    )

                existing_object = existing_object.first()

                update_object(existing_object, object, self.model)
                return Response(
                    {"success": "Successfully updated object"},
                    status=status.HTTP_200_OK,
                )
        except Exception as e:
            return Response(
                {"error": "Failed to update object"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class BatchRestViewSet(viewsets.ModelViewSet):
    """Custom viewset that allows batched create, read, and update operations
    for multiple objects via a single call to a POST endpoint. Inherits from
    the ModelViewSet which also provides standard REST CRUD endpoints.
    The Derived class of BatchRestViewSet must set a 'model_class'
    instance field which contains the model class to create CRUD endpoints
    for. The Derived class must also use a serializer of type BatchRestSerializer."""

    def create(self, request, *args, **kwargs):
        """Overridden POST Method for batch updating/creating/deleting
        arrays of objects.

        Deleted rows must include an "isDeleted" field set to true.
        Changed rows must include the original row id.
        Created rows must not have an id."""

        if isinstance(request.data, list):
            for data_row in request.data:
                if "isDeleted" in data_row:
                    # Delete objects
                    if "id" not in data_row:
                        Response(
                            "No id was found for deleted row.",
                            status=status.HTTP_400_BAD_REQUEST,
                        )

                    object = self.model_class.objects.filter(pk=data_row["id"])

                    if not object.exists():
                        return Response(
                            "object id " + data_row.id + " was not found.",
                            status=status.HTTP_404_NOT_FOUND,
                        )

                    object.delete()
                else:
                    # Create and update objects
                    serializer = self.serializer_class(data=data_row, partial=True)
                    if serializer.is_valid():
                        serializer.save()
                    else:
                        return Response(
                            serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST,
                        )
            return Response("Successfully batch updated.", status=status.HTTP_200_OK)
        else:
            return super(viewsets.ModelViewSet, self).create(request, *args, **kwargs)
