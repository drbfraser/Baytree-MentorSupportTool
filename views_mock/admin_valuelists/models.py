from django.db import models

# Create your models here.


class ValueList(models.Model):
    class TypeEnum(models.TextChoices):
        STAFF = "Staff"
        VOLUNTEER = "Volunteer"
        INDIVIDUAL = "Individual"
        PERSON = "Person"
        GROUP = "Group"
        SESSION = "Session"
        SESSION_GROUP = "SessionGroup"
        QUESTION = "Question"
        AGENCY = "Agency"
        VENUE = "Venue"
        QUALIFICATION_PROGRESS = "QualificationProgress"
        QUALIFICATION_ACHIEVEMENT = "QualificationAchievement"
        ADDRESS_BOOK = "AddressBook"
        REPORT = "Report"

    ValueListID = models.IntegerField(primary_key=True)
    Type = models.CharField(
        max_length=50, choices=TypeEnum.choices, blank=False, null=False, default=TypeEnum.STAFF)
    Name = models.CharField(max_length=50)

    class Meta:
        unique_together = (("Type", "Name"),)


class ValueListItem(models.Model):
    valueList = models.ForeignKey(
        ValueList, on_delete=models.CASCADE, db_column="ValueListID")
    value = models.CharField(max_length=50)
