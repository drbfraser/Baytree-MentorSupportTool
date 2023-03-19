from django.db import models

# Create your models here.


class ValueList(models.Model):
    ValueListID = models.IntegerField(primary_key=True)
    Type = models.CharField(max_length=50)
    Name = models.CharField(max_length=50)


class ValueListItem(models.Model):
    id = models.AutoField(primary_key=True)
    valueList = models.OneToOneField(
        ValueList, on_delete=models.CASCADE, related_name="ValueListItem", db_column="ValueListID")
    value = models.CharField(max_length=50)
