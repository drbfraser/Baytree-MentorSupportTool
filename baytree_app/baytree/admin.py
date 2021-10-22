from django.contrib import admin
from .import models

# Register your models here.
class BaytreeAdminArea(admin.AdminSite):
    site_header = ' '
    login_template = 'baytree/admin/login.html'

blog_site = BaytreeAdminArea(name='BaytreeAdmin')

blog_site.register(models.Post)