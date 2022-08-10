from rest_framework.response import Response
from .constants import views_base_url, views_username, views_password
from rest_framework.decorators import permission_classes, api_view
from rest_framework import status
from users.permissions import AdminPermissions
import requests
import json

questionnaires_base_url = views_base_url + "evidence/questionnaires/search.json"

questionnaire_views_response_fields = [
    "QuestionnaireID",
    "Title",
    "Description",
    "Created",
    "Updated",
    "CreatedBy",
    "UpdatedBy",
]
questionnaire_translated_fields = [
    "viewsQuestionnaireId",
    "title",
    "description",
    "created",
    "updated",
    "createdBy",
    "updatedBy",
]


@api_view(("GET",))
@permission_classes((AdminPermissions,))
def get_questionnaires_endpoint(request):
    views_response = requests.get(
        questionnaires_base_url,
        auth=(views_username, views_password),
    )

    parsedJson = json.loads(views_response.text)

    parsedQuestionnaires = []

    for questionnaires in parsedJson.items():
        for questionnaire in questionnaires[1].items():
            parsedQuestionnaires.append(questionnaire[1])

    translatedQuestionnaires = [
        {
            questionnaire_translated_fields[i]: int(questionnaire[field])
            if field == "QuestionnaireID"
            else questionnaire[field]
            for i, field in enumerate(questionnaire_views_response_fields)
        }
        for questionnaire in parsedQuestionnaires
    ]

    response = {
        "total": len(translatedQuestionnaires),
        "data": translatedQuestionnaires,
    }

    return Response(response, status=status.HTTP_200_OK)
