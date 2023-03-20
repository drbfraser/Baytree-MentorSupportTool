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
    AnswerSetID = models.AutoField(primary_key=True)
    QuestionID = models.ForeignKey(Question, on_delete=models.CASCADE)
    Answer = models.ForeignKey(Answer, on_delete=models.CASCADE)
    EntityType = models.CharField(max_length=100)
    EntityID = models.IntegerField()
    Date = models.DateTimeField(auto_now_add=True)

class Answer(models.Model):
    AnswerID = models.AutoField(primary_key=True)
    AnswerSetID = models.ForeignKey(AnswerSet, on_delete=models.CASCADE)
    QuestionnaireID = models.ForeignKey(Questionnaire, on_delete=models.CASCADE)
    QuestionID = models.ForeignKey(Question, on_delete=models.CASCADE)
    Answer = models.CharField(max_length=1000)