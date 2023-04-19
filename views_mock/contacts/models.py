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

class Participant(models.Model):
    person = models.OneToOneField(
        Person, on_delete=models.CASCADE, related_name="participant", db_column="PersonID")
    FirstLanguage_P_88 = models.CharField(max_length=20)
    Ethnicity = models.CharField(max_length=20)
    Countryofbirth_P_87 = models.CharField(max_length=50, null=True)


class Volunteer(models.Model):
    person = models.OneToOneField(
        Person, on_delete=models.CASCADE, related_name="volunteer", db_column="PersonID")
    Whatisyourfirstlanguage_V_19 = models.CharField(max_length=20)
    Ethnicity_V_15 = models.CharField(max_length=20)
    County = models.CharField(max_length=50, null=True)

class Note(models.Model):
    class Visibility(models.IntegerChoices):
        PUBLIC = 0,
        PRIVATE = 1

    class NoteType(models.TextChoices):
        PERSON = "Person",
        SESSION = "Session"

    NoteID = models.AutoField(primary_key=True)
    Created = models.DateTimeField(auto_now_add=True, null=False)
    Updated = models.DateTimeField(auto_now=True, null=False)
    CreatedBy = models.CharField(max_length=50, null=False)
    UpdatedBy = models.CharField(max_length=50, null=False)
    Note = models.CharField(max_length=500, blank=False, null=False)
    Private = models.IntegerField(choices=Visibility.choices)
    Type = models.CharField(max_length=10, choices=NoteType.choices, default=NoteType.PERSON, null=False, blank=False)

class PersonNote(models.Model):
    note = models.OneToOneField(Note, on_delete=models.CASCADE, related_name="personNote", db_column="NoteID")
    TypeID = models.ForeignKey(Person, on_delete=models.CASCADE, db_column="PersonID")
    
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
        Person, on_delete=models.CASCADE, related_name="master_association", db_column="MasterID")
    SlaveType = models.CharField(
        max_length=20,
        choices=PersonTypeEnum.choices,
        default=None,
        null=True
    )
    SlaveID = models.ForeignKey(
        Person, on_delete=models.CASCADE, related_name="slave_association", db_column="SlaveID")
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
