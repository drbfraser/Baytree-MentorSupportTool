from django.db import models

# Create your models here.

class LowerCaseCharField(models.CharField):
    def get_prep_value(self, value):
        return str(value).lower()

class ValueList(models.Model):
    class TypeEnum(models.TextChoices):
        STAFF = "staff"
        VOLUNTEER = "volunteer"
        INDIVIDUAL = "individual"
        PERSON = "person"
        GROUP = "group"
        SESSION = "session"
        SESSION_GROUP = "sessiongroup"
        QUESTION = "question"
        AGENCY = "agency"
        VENUE = "venue"
        QUALIFICATION_PROGRESS = "qualificationprogress"
        QUALIFICATION_ACHIEVEMENT = "qualificationachievement"
        ADDRESS_BOOK = "addressbook"
        REPORT = "report"

    ValueListID = models.IntegerField(primary_key=True)
    Type = models.CharField(
        max_length=50, choices=TypeEnum.choices, blank=False, null=False, default=TypeEnum.STAFF)
    Name = LowerCaseCharField(max_length=50, blank=False, null=False)

    class Meta:
        unique_together = (("Type", "Name"),)


class ValueListItem(models.Model):
    valueList = models.ForeignKey(
        ValueList, on_delete=models.CASCADE, db_column="ValueListID")
    value = models.CharField(max_length=50)
