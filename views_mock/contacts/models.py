from django.db import models

class Person(models.Model):
    class TypeNameEnum(models.TextChoices):
        VOLUNTEER = 'volunteer'
        PARTICIPANT = 'participant'
        STAFF = 'staff'

    PersonID = models.IntegerField()
    TypeName = models.CharField(
        max_length=20,
        choices=TypeNameEnum.choices,
        default=None,
        null=True
    )
    Forename = models.CharField(max_length=30)
    Surname = models.CharField(max_length=30)
    Email = models.EmailField(null=True)
    DateOfBirth = models.DateField()
    Country = models.CharField(max_length=50, null=True)

class Participant(models.Model):
    PersonID = models.ForeignKey(Person, on_delete=models.CASCADE)
    FirstLanguage_P_88 = models.CharField(max_length=20, null=True)
    Ethnicity = models.CharField(max_length=20, null=True)


class Volunteer(models.Model):
    PersonID = models.ForeignKey(Person, on_delete=models.CASCADE)
    Whatisyourfirstlanguage_V_19 = models.CharField(max_length=20, null=True)
    Ethnicity_V_15 = models.CharField(max_length=20, null=True)



