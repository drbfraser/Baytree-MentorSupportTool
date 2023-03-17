from django.db import models

class Questionnaire(models.Model):
    # ID field is automatically generated
    title = models.CharField(verbose_name="Title", max_length=100)
    description = models.TextField(verbose_name="Description")
    created = models.DateTimeField(auto_now_add=True, verbose_name="Created")
    updated = models.DateTimeField(auto_now=True, verbose_name="Updated")
    createdBy = models.CharField(verbose_name="CreatedBy", max_length=50)
    updatedBy = models.CharField(verbose_name="UpdatedBy", max_length=50)

class Question(models.Model):
    # question id field is automatically generated
    questionID = models.ForeignKey(Questionnaire, on_delete=models.CASCADE, verbose_name="QuestionnaireID")
    sourceID = models.IntegerField(verbose_name="SourceID")
    question = models.CharField(verbose_name="Question", max_length=500)
    valueListID = models.IntegerField(verbose_name="valueListID")
    inputType = models.CharField(verbose_name="inputType", max_length=50)
    validation = models.CharField(verbose_name="validation", max_length=100)
    category = models.CharField(verbose_name="category", max_length=50)
    enabled = models.IntegerField(verbose_name="enabled")

class AnswerSet(models.Model):
    questionID = models.ForeignKey(Question, on_delete=models.CASCADE, verbose_name="QuestionID", related_name="questionIdOfQuestion")
    answerID = models.ForeignKey(Question, on_delete=models.CASCADE, verbose_name="AnswerID", related_name="answerIdOfQuestion")
    answer = models.CharField(verbose_name="Answer", max_length=1000)
    entityType = models.CharField(verbose_name="EntityType", max_length=100)
    entityID = models.IntegerField(verbose_name="EntityID")
    date = models.DateTimeField(verbose_name="Date")
