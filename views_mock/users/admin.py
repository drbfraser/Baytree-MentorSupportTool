from django.contrib import admin
from django.contrib.sites.models import Site
from django.contrib.auth.models import Group
from rest_framework.authtoken.models import TokenProxy

from .models import *

admin.site.register(CustomUser)
admin.site.register(MentorUser)
admin.site.register(MenteeUser)

admin.site.unregister(TokenProxy)

admin.site.unregister(Group)
admin.site.unregister(Site)
