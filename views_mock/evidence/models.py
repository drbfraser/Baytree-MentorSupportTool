from django.db import models

class Questionnaire(models.Model):
    QuestionnaireID = models.AutoField(primary_key=True)
    Title = models.CharField(max_length=100)
    Description = models.TextField()
    Created = models.DateTimeField(auto_now_add=True)
    Updated = models.DateTimeField(auto_now=True)
    CreatedBy = models.CharField(max_length=50)
    UpdatedBy = models.CharField(max_length=50)

class Question(models.Model):
    QuestionID = models.AutoField(primary_key=True)
    QuestionnaireID = models.ForeignKey(Questionnaire, on_delete=models.CASCADE)
    SourceID = models.IntegerField()
    Question = models.CharField(max_length=500)
    valueListID = models.IntegerField()
    inputType = models.CharField(max_length=50)
    validation = models.CharField(max_length=100)
    category = models.CharField(max_length=50)
    enabled = models.IntegerField()

class AnswerSet(models.Model):
    QuestionID = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="questionIdOfQuestion")
    AnswerID = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="answerIdOfQuestion")
    Answer = models.CharField(max_length=1000)
    EntityType = models.CharField(max_length=100)
    EntityID = models.IntegerField()
    Date = models.DateTimeField()
