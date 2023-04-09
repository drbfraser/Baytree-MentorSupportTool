from django.db import models
from django.db.models import CheckConstraint, Q, F

class Person(models.Model):
    class TypeNameEnum(models.TextChoices):
        VOLUNTEER = 'volunteer'
        PARTICIPANT = 'participant'
        STAFF = 'staff'

    PersonID = models.AutoField(primary_key=True)
    TypeName = models.CharField(
        max_length=20,
        choices=TypeNameEnum.choices,
        default=None,
        null=True
    )
    Forename = models.CharField(max_length=30)
    Surname = models.CharField(max_length=30)
    Email = models.EmailField(null=True)
    DateOfBirth = models.DateField(null=False)
    Country = models.CharField(max_length=50, null=True)


class Participant(models.Model):
    person = models.OneToOneField(
        Person, on_delete=models.CASCADE, related_name="participant", db_column="PersonID")
    FirstLanguage_P_88 = models.CharField(max_length=20)
    Ethnicity = models.CharField(max_length=20)


class Volunteer(models.Model):
    person = models.OneToOneField(
        Person, on_delete=models.CASCADE, related_name="volunteer", db_column="PersonID")
    Whatisyourfirstlanguage_V_19 = models.CharField(max_length=20)
    Ethnicity_V_15 = models.CharField(max_length=20)

class Association(models.Model):
    class PersonTypeEnum(models.TextChoices):
        VOLUNTEER = 'volunteer'
        PARTICIPANT = 'participant'
        STAFF = 'staff'

    AssociationID = models.AutoField(primary_key=True)
    MasterType = models.CharField(
        max_length=20,
        choices=PersonTypeEnum.choices,
        default=None,
        null=True
    )
    MasterID = models.ForeignKey(
        Person, on_delete=models.CASCADE, related_name="master_association")
    SlaveType = models.CharField(
        max_length=20,
        choices=PersonTypeEnum.choices,
        default=None,
        null=True
    )
    SlaveID = models.ForeignKey(
        Person, on_delete=models.CASCADE, related_name="slave_association")
    Association = models.CharField(max_length=20)
    Description = models.TextField(null=True)
    StartDate = models.DateField(auto_now_add=True)
    EndDate = models.DateField(null=True)

    class Meta:
        constraints = [
            CheckConstraint(
                check=~Q(MasterID=F('SlaveID')),
                name='master_slave_not_equal'
            )
        ]