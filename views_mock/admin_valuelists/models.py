from django.db import models

# Create your models here.


class ValueList(models.Model):
    ValueListID = models.IntegerField(primary_key=True)
    Type = models.CharField(max_length=50)
    Name = models.CharField(max_length=50)


class ValueListItem(models.Model):
    valueList = models.ForeignKey(ValueList, on_delete=models.CASCADE)
    value = models.CharField(max_length=50)
