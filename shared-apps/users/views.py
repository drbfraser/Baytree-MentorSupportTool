import re
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from baytree_app.views import BatchRestViewSet

from .serializers import MentorRoleSerializer
from baytree_app.views import create_object
from baytree_app.settings import EMAIL_USER
from emails.email import generateEmailTemplateHtml
from .models import (
    AccountCreationLink,
    MentorRole,
    MentorRoleActivity,
    ResetPasswordLink,
    CustomUser,
    MentorUser,
    SessionStats
)
from .constants import (
    views_username,
    views_password,
    views_mentor_base_url,
    views_mentee_base_url,
)
from .permissions import *
from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes,
)
import os
from django.core.mail import send_mail
import datetime
from django.utils.timezone import make_aware
import requests
import xmltodict


# Provides Mentor Role CRUD REST API endpoints with bulk-update/create support
# adapted from https://stackoverflow.com/a/61490489
class MentorRoleViewSet(BatchRestViewSet):
    queryset = MentorRole.objects.all().order_by("name")
    serializer_class = MentorRoleSerializer
    filterset_fields = {"name": ["icontains", "exact"]}
    model_class = MentorRole

    def get_permissions(self):
        if (
            self.action == "create"
            or self.action == "update"
            or self.action == "partial_update"
            or self.action == "destroy"
        ):
            permission_classes = [IsAuthenticated & AdminPermissions]
        elif self.action == "list" or self.action == "retrieve":
            permission_classes = [
                IsAuthenticated & (AdminPermissions | MentorPermissions)
            ]

        return [permission() for permission in permission_classes]

def createUsers(users: dict):
    ids = []
    if "array" in users:
        for object in users["array"]:
            create_args = {}

            for key, val in object.items():
                if not isinstance(val, list):
                    create_args[key] = val

            created_obj = CustomUser.objects.create_user(**create_args)

            ids.append(created_obj.pk)

            for key, val in object.items():
                if isinstance(val, list):
                    getattr(created_obj, key).add(*val)

        return ids
    else:
        object = users
        create_args = {}

        for key, val in object.items():
            if not isinstance(val, list):
                create_args[key] = val

        created_obj = CustomUser.objects.create_user(**create_args)

        ids.append(created_obj.pk)

        for key, val in object.items():
            if isinstance(val, list):
                getattr(created_obj, key).add(*val)

        return [created_obj.pk]


def postUser(self, request):
    try:
        ids = createUsers(request.data)
        return Response({"ids": ids}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {"error": "Failed to create user(s)"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["POST"])
@permission_classes((AdminPermissions,))
def sendAccountCreationEmail(request):
    try:
        views_person_id = request.data["viewsPersonId"]
        mentor_first_name = request.data["mentorFirstName"]
        email = request.data["email"]
        account_type = request.data["accountType"]

        foundAccountCreationLink = AccountCreationLink.objects.filter(
            views_person_id=views_person_id
        )
        if foundAccountCreationLink.exists():
            foundAccountCreationLink.first().delete()

        account_creation_link = AccountCreationLink(
            views_person_id=views_person_id, account_type=account_type, email=email
        )
        account_creation_link.save()

        if os.environ.get("DEBUG", "") != "yes" and os.environ.get("DOMAIN") != None:
            email_account_creation_link = (
                "https://"
                + os.environ["DOMAIN"]
                + "/createAccount/"
                + str(account_creation_link.link_id)
            )
        else:
            email_account_creation_link = (
                "http://localhost:3000"
                + "/createAccount/"
                + str(account_creation_link.link_id)
            )

        email_html = generateEmailTemplateHtml(
            "mentorAccountCreation",
            {
                "mentorFirstName": mentor_first_name,
                "createAccountButtonLink": email_account_creation_link,
            },
        )

        # Send email to Mentor to confirm their account
        send_mail(
            subject="Welcome to The Baytree Centre!",
            message="Welcome to The Baytree Centre! Click this link to create your account: "
            + email_account_creation_link,
            from_email=EMAIL_USER,
            recipient_list=[email],
            html_message=email_html,
        )

        return Response(
            {"status": "Successfully sent account creation email!"},
            status=status.HTTP_200_OK,
        )

    except Exception as e:
        return Response(
            {"error": "Failed to send account creation email"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


def isLinkExpired(link):
    return make_aware(datetime.datetime.now()) >= link.link_expiry_date


def isValidPassword(password: str) -> bool:
    """Returns True if password contains at least one lower case,
    upper case, digit, symbol, and at least 8 characters and no more than 30"""

    if password == None:
        return False

    VALID_PASS_REGEX = r"(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)"
    password_len = len(password)
    return (
        re.match(VALID_PASS_REGEX, password) != None
        and password_len >= 8
        and password_len <= 30
    )


@api_view(["POST"])
@authentication_classes([])
@permission_classes([])
def createMentorAccount(request):
    try:
        password = request.data["password"]

        if not isValidPassword(password):
            return Response(
                {"error": "Invalid password format."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        create_account_link_id = request.data["createAccountLinkId"]
        if password != None and create_account_link_id != None:
            foundAccountCreationLink = AccountCreationLink.objects.filter(
                link_id=create_account_link_id
            )
            if foundAccountCreationLink.exists():
                if isLinkExpired(foundAccountCreationLink.first()):
                    return Response(
                        {"error": "Link is expired"}, status=status.HTTP_410_GONE
                    )

                foundAccountCreationLink = foundAccountCreationLink.first()
                createdUserIds = createUsers(
                    {"email": foundAccountCreationLink.email, "password": password}
                )
                createdUserId = createdUserIds[0]

                data_privacy_consent = make_aware(datetime.datetime.now())
                create_object(
                    {
                        "user": createdUserId,
                        "status": "Active",
                        "viewsPersonId": foundAccountCreationLink.views_person_id,
                        "data_privacy_consent": data_privacy_consent,
                    },
                    MentorUser,
                )
                foundAccountCreationLink.delete()

                return Response(
                    {"status": "Successfully created mentor account"},
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {"error": "Link invalid"}, status=status.HTTP_401_UNAUTHORIZED
                )
        else:
            return Response(
                {"error": "Failed to create mentor account"},
                status=status.HTTP_400_BAD_REQUEST,
            )
    except Exception as e:
        return Response(
            {"error": "Failed to create mentor account"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


class StatisticViews(APIView):
    permission_classes = [MentorsViewPermissions]

    def get(self, request, type):

        id = request.GET.get("id", None)

        sessions_total = 0
        sessions_attended = 0
        sessions_missed = 0
        sessions_total_perYear = 52  # sessions assumed to be once a week
        sessions_remaining = 0

        if type == "mentor":
            mentorUser = MentorUser.objects.all().filter(user_id=id)
            if len(mentorUser) > 0:
                try:
                    session_stats = SessionStats.objects.get(
                        mentor=mentorUser[0])
                    sessions_total = session_stats.sessions_total
                    sessions_attended = session_stats.sessions_attended
                    sessions_missed = session_stats.sessions_missed
                    sessions_remaining = session_stats.sessions_remaining
                except SessionStats.DoesNotExist:
                    pass

        elif type == "mentee":
            # TODO: The mentee ID is hard coded here as 4. Once the Mentee portal is created
            # replace the hardcoded mentee ID. after replacing the hardcoded 4, then this
            # section would be completed and ready to be used for mentee's statistics
            all_participants_url = views_mentee_base_url + "4"

            # get mentee sessions from Viewsapp
            try:
                responseSession = requests.get(
                    all_participants_url + "/sessions",
                    headers={"content-type": "text/xml"},
                    auth=(views_username, views_password),
                )
            except Exception as e:
                return Response(
                    {"errors": "Request to viewsapp for session failed"}, status=400
                )

            # turn the xml response to dictionary
            parsedSession = xmltodict.parse(responseSession.text)

            # Check to see if the mentee has zero sessions entered
            if parsedSession["participant"]["sessions"] is None:
                return Response(
                    {
                        "status": "success",
                        "data": {
                            "sessions_total": sessions_total,
                            "sessions_attended": sessions_attended,
                            "sessions_missed": sessions_missed,
                            "sessions_remaining": (
                                sessions_total_perYear - sessions_total
                            ),
                        },
                    },
                    status=status.HTTP_200_OK,
                )

            # sort throught the dictionary
            participantSessionList = parsedSession["participant"]["sessions"]["session"]

            # counting the session atteded and not attended
            for sessionDict in participantSessionList:
                sessions_total += 1
                if sessionDict["Status"] == "Attended":
                    sessions_attended += 1
                else:
                    sessions_missed += 1
            sessions_remaining = sessions_total_perYear - sessions_total

        return Response(
            {
                "status": "success",
                "data": {
                    "sessions_total": sessions_total,
                    "sessions_attended": sessions_attended,
                    "sessions_missed": sessions_missed,
                    "sessions_remaining": sessions_remaining,
                },
            },
            status=status.HTTP_200_OK,
        )


# Allow non-authenticated users to send a reset email (be careful!)
@api_view(["POST"])
@authentication_classes([])
@permission_classes([])
def sendResetPasswordEmail(request):
    SUCCESS_RESPONSE_MESSAGE = "Successfully sent reset link email!"

    try:
        email = request.data["email"]
        account_type = request.data["accountType"]

        user = None
        if account_type == "Mentor":
            user = CustomUser.objects.filter(email=email)
            if not user.exists():
                # Send 200 OK so malicious users can't tell if email is registered
                return Response(
                    {"status": SUCCESS_RESPONSE_MESSAGE}, status=status.HTTP_200_OK
                )

            user = MentorUser.objects.filter(user_id=user.first().id)
            if not user.exists():
                # Send 200 OK so malicious users can't tell if email is registered
                return Response(
                    {"status": SUCCESS_RESPONSE_MESSAGE}, status=status.HTTP_200_OK
                )

        if user == None:
            return Response(
                {"error": "Account type is not recognized!"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Delete before resending reset password email and generate new link
        found_reset_password_link = ResetPasswordLink.objects.filter(
            email=email)
        if found_reset_password_link.exists():
            found_reset_password_link.first().delete()

        password_reset_link = ResetPasswordLink(
            account_type=account_type, email=email)
        password_reset_link.save()

        if os.environ.get("DEBUG", "") != "yes" and os.environ.get("DOMAIN") != None:
            reset_password_link = (
                "https://"
                + os.environ["DOMAIN"]
                + "/resetPassword/"
                + str(password_reset_link.link_id)
            )
        else:
            reset_password_link = (
                "http://localhost:3000"
                + "/resetPassword/"
                + str(password_reset_link.link_id)
            )

        if account_type == "Mentor":
            email_html = generateEmailTemplateHtml(
                "mentorResetPassword", {
                    "resetPasswordButtonLink": reset_password_link}
            )

        # Send email to Mentor to confirm their account
        send_mail(
            subject="Password Reset",
            message="Click this link to reset your Baytree account password: "
            + reset_password_link,
            from_email=EMAIL_USER,
            recipient_list=[email],
            html_message=email_html,
        )

        return Response({"status": SUCCESS_RESPONSE_MESSAGE}, status=status.HTTP_200_OK)

    except KeyError as e:
        return Response(
            {"error": "Incorrect POST request body format."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    except Exception as e:
        return Response(
            {"error": "Failed to send account creation email"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


# Allow non-authenticated users to reset password (be careful!)
@api_view(["PUT"])
@authentication_classes([])
@permission_classes([])
def resetAccountPassword(request):
    try:
        password = request.data["password"]

        if not isValidPassword(password):
            return Response(
                {"error": "Invalid password format."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        reset_password_link_id = request.data["resetPasswordLinkId"]
        found_password_reset_link = ResetPasswordLink.objects.filter(
            link_id=reset_password_link_id
        )

        if found_password_reset_link.exists():
            found_password_reset_link = found_password_reset_link.first()
            if isLinkExpired(found_password_reset_link):
                return Response(
                    {"error": "Link is expired"}, status=status.HTTP_410_GONE
                )

            email = found_password_reset_link.email
            user = CustomUser.objects.filter(email=email)
            if not user.exists():
                return Response(
                    {"error": "User doesn't exist!"}, status=status.HTTP_404_NOT_FOUND
                )
            user = user.first()

            user.set_password(password)
            user.save()

            found_password_reset_link.delete()

            return Response(
                {"status": "Successfully created mentor account"},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"error": "Link invalid"}, status=status.HTTP_401_UNAUTHORIZED
            )

    except KeyError as e:
        return Response(
            {"error": "Request POST body parameters in invalid format."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    except Exception as e:
        return Response(
            {"error": "Failed to create mentor account"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["GET"])
def getActivitiesForMentor(request):
    mentorUser = MentorUser.objects.all().filter(user_id=request.user.id)
    if not mentorUser.exists():
        return Response(
            {"error": "Mentor does not exist with the given id"},
            status=status.HTTP_404_NOT_FOUND,
        )

    mentorRole = mentorUser.first().mentorRole
    if not mentorRole:
        return Response(
            {"error": "Mentor does not have mentor role set"},
            status=status.HTTP_404_NOT_FOUND,
        )

    mentorRoleActivities = MentorRoleActivity.objects.filter(
        mentorRole=mentorRole)

    return Response(
        [mentorRoleActivity.activity for mentorRoleActivity in mentorRoleActivities],
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
@authentication_classes([])
@permission_classes([])
def verifyCreationLink(request):
    id = request.data["id"]
    accountCreationLinkId = AccountCreationLink.objects.filter(link_id=id)
    if not accountCreationLinkId.exists():
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    if isLinkExpired(accountCreationLinkId.first()):
        return Response(status=status.HTTP_410_GONE)
    else:
        return Response(status=status.HTTP_200_OK)


@api_view(["POST"])
@authentication_classes([])
@permission_classes([])
def verifyResetLink(request):
    id = request.data["id"]
    resetPasswordLinkId = ResetPasswordLink.objects.filter(link_id=id)
    if not resetPasswordLinkId.exists():
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    if isLinkExpired(resetPasswordLinkId.first()):
        return Response(status=status.HTTP_410_GONE)
    return Response(status=status.HTTP_200_OK)
