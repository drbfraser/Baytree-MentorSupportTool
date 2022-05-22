import datetime
import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

from sessions.models import Activity
from .managers import CustomUserManager
from django.utils.timezone import make_aware


class CustomUser(AbstractUser):
    username = None
    email = models.EmailField(_("email address"), unique=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email


class Mentoring(models.Model):
    mentorUser = models.ForeignKey("MentorUser", on_delete=models.CASCADE)
    menteeUser = models.ForeignKey("MenteeUser", on_delete=models.CASCADE)


class MentorRole(models.Model):
    name = models.CharField(max_length=50, null=False)
    viewsSessionGroupId = models.IntegerField(null=True)
    activity = models.OneToOneField(
        Activity, on_delete=models.SET_NULL, default=None, null=True
    )

    def __str__(self):
        return self.name


class MentorUser(models.Model):
    STATUS = (
        ("Active", "Active"),
        ("Withdrawn", "Withdrawn"),
        ("On Hold", "On Hold"),
        ("Temporarily Withdrawn", "Temporarily Withdrawn"),
        ("Future Leaver", "Future Leaver"),
        ("Staff", "Staff"),
        ("Inactive", "Inactive"),
    )

    user = models.OneToOneField(
        CustomUser,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name="mentoruser",
    )
    status = models.CharField(max_length=30, default="Active", choices=STATUS)
    viewsPersonId = models.CharField(max_length=30, default=None)
    menteeUsers = models.ManyToManyField("MenteeUser", through=Mentoring)

    def __str__(self):
        return self.user.last_name + ", " + self.user.first_name


class MenteeUser(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, primary_key=True)
    mentorUsers = models.ManyToManyField("MentorUser", through=Mentoring)

    def __str__(self):
        return self.user.last_name + ", " + self.user.first_name


class AdminUser(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, primary_key=True)

    def __str__(self):
        return self.user.last_name + ", " + self.user.first_name


def generateAccountCreationLinkExpiryDateTime():
    ACCOUNT_CREATION_LINK_EXPIRY_TIME_IN_DAYS = 7  # 1 week
    return make_aware(datetime.datetime.now()) + datetime.timedelta(
        days=ACCOUNT_CREATION_LINK_EXPIRY_TIME_IN_DAYS
    )


class AccountCreationLink(models.Model):
    ACCOUNT_TYPES = (("Mentor", "Mentor"), ("Mentee", "Mentee"), ("Admin", "Admin"))

    email = models.EmailField(_("email address"), unique=True, blank=True, null=True)
    account_type = models.CharField(
        max_length=30, default="Mentor", choices=ACCOUNT_TYPES
    )
    views_person_id = models.CharField(max_length=30, default=None)
    link_id = models.UUIDField(default=uuid.uuid4, editable=False)
    link_expiry_date = models.DateTimeField(
        default=generateAccountCreationLinkExpiryDateTime, blank=True
    )


def generateResetPasswordLinkExpiryDateTime():
    RESET_PASSWORD_LINK_EXPIRY_TIME_IN_DAYS = 7  # 1 week
    return make_aware(datetime.datetime.now()) + datetime.timedelta(
        days=RESET_PASSWORD_LINK_EXPIRY_TIME_IN_DAYS
    )


class ResetPasswordLink(models.Model):
    ACCOUNT_TYPES = (("Mentor", "Mentor"), ("Mentee", "Mentee"), ("Admin", "Admin"))

    email = models.EmailField(_("email address"), unique=True, blank=True, null=True)
    account_type = models.CharField(
        max_length=30, default="Mentor", choices=ACCOUNT_TYPES
    )
    link_id = models.UUIDField(default=uuid.uuid4, editable=False)
    link_expiry_date = models.DateTimeField(
        default=generateResetPasswordLinkExpiryDateTime, blank=True
    )
