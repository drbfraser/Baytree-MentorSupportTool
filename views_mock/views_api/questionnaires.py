from users.permissions import AdminPermissions
from rest_framework.decorators import permission_classes, api_view, renderer_classes
from evidence.models import Questionnaire, Question
from rest_framework.response import Response
from rest_framework_xml.renderers import XMLRenderer
from evidence.models import AnswerSet, Answer
import xmltodict
from xml.etree.ElementTree import Element, SubElement, tostring

ANSWER_SET_FIELDS = [
   "EntityType",
   "EntityID", 
   "Date",
   "answer"
]

ANSWER_FIELDS = [
   "@id",
   "QuestionID",
   "Answer"
]

@api_view(("GET",))
@permission_classes([AdminPermissions])
def get_questionnaire_by_id(request, questionnaireId: int):
  data = {}
  try:
    questionnaire = Questionnaire.objects.get(pk=questionnaireId)
  except Exception as e:
    print(f"Exception: {e}")
    return Response(data, status=200)
  
  data["QuestionnaireID"] = str(questionnaireId)
  data["Title"] = questionnaire.Title
  data["Description"] = questionnaire.Description
  data["Created"] = questionnaire.Created
  data["Updated"] = questionnaire.Updated
  data["CreatedBy"] = questionnaire.CreatedBy
  data["UpdatedBy"] = questionnaire.UpdatedBy

  questionsData = {}

  associatedQuestions = Question.objects.filter(QuestionnaireID=questionnaireId)
  for question in associatedQuestions:
    questionInfo = {}
    questionInfo["QuestionID"] = str(question.QuestionID)
    questionInfo["Question"] = question.Question
    questionInfo["valueListID"] = question.valueListID
    questionInfo["inputType"] = question.inputType
    questionInfo["validation"] = question.validation
    questionInfo["category"] = question.category
    questionInfo["enabled"] = str(question.enabled)

    questionsData[question.QuestionID] = questionInfo

  data["questions"] = questionsData

  return Response(data, 200)

@api_view(("GET",))
@permission_classes([AdminPermissions])
def search_questionnaires(request):
  limit = int(request.GET.get("pageFold", 100))
  offset = int(request.GET.get("offset", 0))
  title = request.GET.get("Title", "")

  data = {}
  dataQuestionnaire = {}

  questionnaires = Questionnaire.objects.filter(Title__contains=title)[offset:limit]
  count = len(questionnaires)

  for questionnaire in questionnaires:
    questionnaireInfo = {}
    questionnaireInfo["QuestionnaireID"] = str(questionnaire.QuestionnaireID)
    questionnaireInfo["Title"] = questionnaire.Title
    questionnaireInfo["Description"] = questionnaire.Description
    questionnaireInfo["Created"] = questionnaire.Created
    questionnaireInfo["Updated"] = questionnaire.Updated
    questionnaireInfo["CreatedBy"] = questionnaire.CreatedBy
    questionnaireInfo["UpdatedBy"] = questionnaire.UpdatedBy

    dataQuestionnaire[f"questionnaire id=\"{questionnaire.QuestionnaireID}\""] = questionnaireInfo

  data[f"questionnaires count=\"{count}\""] = dataQuestionnaire

  return Response(data, 200)

@api_view(("POST",))
@renderer_classes([XMLRenderer])
def submit_mentee_answer_set(request, menteeId, qid):
  return createAnswerSetWithAnswers(request, qid)

@api_view(("POST",))
@renderer_classes([XMLRenderer])
def submit_mentor_answer_set(request, qid):
  return createAnswerSetWithAnswers(request, qid)

def createAnswerSetWithAnswers(request, qid):
  parsedBody = xmltodict.parse(request.body)
  submittedAnswers = parsedBody["answer"]
  if not isinstance(submittedAnswers, list):
    submittedAnswers = [submittedAnswers]

  answerSet = AnswerSet(QuestionnaireID=qid,
                      EntityType=parsedBody["EntityType"],
                      EntityID=parsedBody["EntityID"],
                      Date=parsedBody["Date"])
  answerSet.save()

  for submittedAnswer in submittedAnswers:
    answer = Answer(AnswerSetID=answerSet.AnswerSetID,
                    QuestionnaireID=qid,
                    QuestionID=submittedAnswer["QuestionID"],
                    Answer=submittedAnswer["Answer"])
    answer.save()

  root = Element('answerset', {
    "questionnaireid": qid,
    "id": answerSet.AnswerSetID.__str__()
  })

  return Response(tostring(root), status=201)