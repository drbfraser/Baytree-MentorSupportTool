from django.contrib import admin
from  users.models import CustomUser

# Register your models here.
class BaytreeAdminArea(admin.AdminSite):
    site_header = 'Baytree Administration'
    login_template = 'admin_login/admin/login.html'

# admin.site = BaytreeAdminArea(name='BaytreeAdmin')

# admin.site.register(CustomUser)

blog_site = BaytreeAdminArea(name='BaytreeAdmin')

blog_site.register(CustomUser)