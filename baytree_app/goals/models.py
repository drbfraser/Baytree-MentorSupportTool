from django.db import models
from users.models import CustomUser

class Goal(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    title = models.CharField(max_length = 100, blank = False, null=True)
    details = models.CharField(max_length = 1000, blank = False, null=True)
    
    def __str__(self):
        return self.title
