from users.permissions import AdminPermissions
from rest_framework.decorators import permission_classes, api_view
from evidence.models import Questionnaire, Question, AnswerSet, Answer
from rest_framework.response import Response

@api_view(("GET",))
@permission_classes([AdminPermissions])
def get_questionnaire_by_id(request, questionnaireId: int):
  data = {}
  try:
    questionnaire = Questionnaire.objects.get(pk=questionnaireId)
  except:
    print(f"No questionnaire with id {str(questionnaireId)}")
    return Response(data, status=404)
  
  data["QuestionnaireID"] = str(questionnaireId)
  data["Title"] = questionnaire.Title
  data["Description"] = questionnaire.Description
  data["Created"] = questionnaire.Created
  data["Updated"] = questionnaire.Updated
  data["CreatedBy"] = questionnaire.CreatedBy
  data["UpdatedBy"] = questionnaire.UpdatedBy

  questionsData = {}

  associatedQuestions = Question.objects.filter(questionnaireId=questionnaireId)
  for question in associatedQuestions:
    questionInfo = {}
    questionInfo["QuestionID"] = str(question.QuestionID)
    questionInfo["Question"] = question.Question
    questionInfo["inputType"] = question.inputType
    questionInfo["validation"] = question.validation
    questionInfo["category"] = question.category
    questionInfo["enabled"] = str(question.enabled)

    questionsData[question.QuestionID] = questionInfo

  data["questions"] = questionsData

  return Response(data, 200)