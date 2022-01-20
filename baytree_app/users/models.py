from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from .managers import CustomUserManager


class CustomUser(AbstractUser):
    username = None
    email = models.EmailField(_('email address'), unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email


class MentorUser(models.Model):
    STATUS = (
        ('Active', 'Active'),
        ('Withdrawn', 'Withdrawn'),
        ('On Hold', 'On Hold'),
        ('Temporarily Withdrawn', 'Temporarily Withdrawn'),
        ('Future Leaver', 'Future Leaver'),
        ('Staff', 'Staff'),
        ('Inactive', 'Inactive')
    )

    user = models.OneToOneField(CustomUser, on_delete=models.PROTECT, primary_key=True, related_name='mentoruser')
    status = models.CharField(max_length=30, choices=STATUS)

    def __str__(self):
        return self.user.last_name + ', ' + self.user.first_name


class MenteeUser(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.PROTECT, primary_key=True)
    mentorid = models.ForeignKey(MentorUser, on_delete=models.PROTECT, related_name='menteeuser')

    def __str__(self):
        return self.user.last_name + ', ' + self.user.first_name
