from http.client import INTERNAL_SERVER_ERROR, HTTPResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from baytree_app.views import create_object
from baytree_app.settings import EMAIL_USER
from emails.constants import BAYTREE_EMAIL
from emails.email import generateEmailTemplateHtml
from views_api.volunteers import get_volunteers
from .serializers import AdminSerializer, MentorSerializer
from .models import AccountCreationLink, CustomUser, MentorUser
from sessions.models import MentorSession
from rest_framework.permissions import AllowAny
from .permissions import *
from rest_framework.decorators import api_view, permission_classes
import os
from django.core.mail import send_mail

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
        return Response({"ids": ids},
                        status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": "Failed to create user(s)"},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['POST'])
@permission_classes((AdminPermissions, ))
def sendAccountCreationEmail(request):
    try:
        views_person_id = request.data['viewsPersonId']
        mentor_first_name = request.data['mentorFirstName']
        email = request.data['email']
        account_type = request.data['accountType']
        if views_person_id != None and account_type != None:
            account_creation_link = AccountCreationLink(views_person_id=views_person_id, \
                account_type=account_type, email=email)
            account_creation_link.save()
            
            if (os.environ.get("DOMAIN") != None):
                email_account_creation_link = "https://" + os.environ["DOMAIN"] \
                    + "/createMentorAccount?id=" + str(account_creation_link.link_id)
            else:
                email_account_creation_link = "http://localhost:3001" \
                    + "/createMentorAccount?id=" + str(account_creation_link.link_id)

            email_html = generateEmailTemplateHtml("mentorAccountCreation", {"mentorFirstName": mentor_first_name, \
                "createAccountButtonLink": email_account_creation_link})

            # Send email to Mentor to confirm their account
            send_mail(subject='Welcome to The Baytree Centre!',
                message='Welcome to The Baytree Centre! Click this link to create your account: ' \
                + email_account_creation_link,
                from_email=EMAIL_USER,
                recipient_list=[email],
                html_message=email_html)

            return Response({"status": "Successfully sent account creation email!"},
                status=status.HTTP_200_OK)
        else:
            return Response({"error": "Failed to send account creation email"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        return Response({"error": "Failed to send account creation email"},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes((AllowAny, ))
def createMentorAccount(request):
    try:
        password = request.data['password']
        create_account_link_id = request.data['createAccountLinkId']
        if password != None and create_account_link_id != None:
            foundAccountCreationLink = \
                AccountCreationLink.objects.filter(link_id=create_account_link_id)
            if foundAccountCreationLink.exists():
                foundAccountCreationLink = foundAccountCreationLink.first()
                createdUserIds = createUsers({"email": foundAccountCreationLink.email,
                    "password": password})
                createdUserId = createdUserIds[0]
                create_object({"user": createdUserId, "status": "Active",
                    "viewsPersonId": foundAccountCreationLink.views_person_id}, MentorUser)
            else:
                return Response({"error": "Link invalid"},
                        status=status.HTTP_401_UNAUTHORIZED)        
        else:
            return Response({"error": "Failed to create mentor account"},
                        status=status.HTTP_400_BAD_REQUEST)    
    except Exception as e:
        return Response({"error": "Failed to create mentor account"},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class StatisticViews(APIView):
    permission_classes = [MentorsViewPermissions]

    def get(self, request, type):
        id = request.GET.get('id', None)
        if type == "mentor":
            sessions_total = MentorSession.objects.filter(mentor_id=id).count()
            sessions_attended = MentorSession.objects.filter(
                mentor_id=id).filter(attended_by_mentor=True).count()
            sessions_missed = MentorSession.objects.filter(
                mentor_id=id).filter(attended_by_mentor=False).count()
            sessions_remaining = 52 - sessions_total  # sessions assumed to be once a week
        elif type == "mentee":
            sessions_total = MentorSession.objects.filter(mentee_id=id).count()
            sessions_attended = MentorSession.objects.filter(
                mentee_id=id).filter(attended_by_mentee=True).count()
            sessions_missed = MentorSession.objects.filter(
                mentee_id=id).filter(attended_by_mentee=False).count()
            sessions_remaining = 52 - sessions_total  # sessions assumed to be once a week
        return Response(
            {"status": "success", "data": {"sessions_total": sessions_total, "sessions_attended": sessions_attended,
                                           "sessions_missed": sessions_missed,
                                           "sessions_remaining": sessions_remaining}},
            status=status.HTTP_200_OK)
