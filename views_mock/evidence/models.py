from django.db import models

class Questionnaire(models.Model):
    QuestionnaireID = models.AutoField(primary_key=True)
    Title = models.CharField(max_length=100, null=False)
    Description = models.TextField()
    Created = models.DateTimeField(auto_now_add=True, null=False)
    Updated = models.DateTimeField(auto_now=True, null=False)
    CreatedBy = models.CharField(max_length=50, null=False)
    UpdatedBy = models.CharField(max_length=50, null=False)

class Question(models.Model):
    QuestionID = models.AutoField(primary_key=True)
    QuestionnaireID = models.ForeignKey(Questionnaire, on_delete=models.CASCADE, db_column="QuestionnaireID")
    SourceID = models.IntegerField()
    Question = models.CharField(max_length=500, null=False)
    valueListID = models.IntegerField()
    inputType = models.CharField(max_length=50, null=False)
    validation = models.CharField(max_length=100)
    category = models.CharField(max_length=50)
    enabled = models.IntegerField()

class AnswerSet(models.Model):
    AnswerSetID = models.AutoField(primary_key=True)
    QuestionnaireID = models.ForeignKey(Questionnaire, on_delete=models.CASCADE, db_column="QuestionnaireID")
    EntityType = models.CharField(max_length=100, null=False)
    EntityID = models.IntegerField(null=False)
    Date = models.DateTimeField(auto_now_add=True, null=False)

class Answer(models.Model):
    AnswerID = models.AutoField(primary_key=True)
    AnswerSetID = models.ForeignKey(AnswerSet, on_delete=models.CASCADE, db_column="AnswerSetID")
    QuestionnaireID = models.ForeignKey(Questionnaire, on_delete=models.CASCADE, db_column="QuestionnaireID")
    QuestionID = models.ForeignKey(Question, on_delete=models.CASCADE, db_column="QuestionID")
    Answer = models.CharField(max_length=1000)