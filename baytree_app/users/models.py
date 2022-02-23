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

class Mentoring(models.Model):
    mentorUser=models.ForeignKey("MentorUser", on_delete=models.CASCADE)
    menteeUser=models.ForeignKey("MenteeUser", on_delete=models.CASCADE)

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

    user = models.OneToOneField(
        CustomUser, on_delete=models.CASCADE, primary_key=True, related_name='mentoruser')
    status = models.CharField(max_length=30, default='Active', choices=STATUS)
    viewsPersonId = models.CharField(max_length=30, default=None)
    menteeUsers = models.ManyToManyField("MenteeUser", through=Mentoring)

    def __str__(self):
        return self.user.last_name + ', ' + self.user.first_name


class MenteeUser(models.Model):
    user = models.OneToOneField(
        CustomUser, on_delete=models.CASCADE, primary_key=True)
    mentorUsers = models.ManyToManyField("MentorUser", through=Mentoring)

    def __str__(self):
        return self.user.last_name + ', ' + self.user.first_name


class AdminUser(models.Model):
    user = models.OneToOneField(
        CustomUser, on_delete=models.CASCADE, primary_key=True)

    def __str__(self):
        return self.user.last_name + ', ' + self.user.first_name
