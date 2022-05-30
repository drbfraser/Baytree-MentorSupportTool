from rest_framework.response import Response
from .constants import views_base_url, views_username, views_password
from rest_framework.decorators import permission_classes, api_view
from rest_framework import status
from users.permissions import AdminPermissions
import requests
import xmltodict

questionnaires_base_url = views_base_url + "evidence/questionnaires/search?q="

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

    parsed = xmltodict.parse(views_response.text)

    # Handle edge case where no questionnaires were returned from views
    questionnaires_count = int(parsed["evidence"]["questionnaires"]["@count"])
    if questionnaires_count == "0":
        response = {"total": questionnaires_count, "data": []}
        return Response(response, status=status.HTTP_200_OK)

    parsed_questionnaire_list = parsed["evidence"]["questionnaires"]["questionnaire"]
    if not isinstance(parsed_questionnaire_list, list):
        parsed_questionnaire_list = [parsed_questionnaire_list]

    questionnaires = [
        {
            questionnaire_translated_fields[i]: int(questionnaire[field])
            if field == "QuestionnaireID"
            else questionnaire[field]
            for i, field in enumerate(questionnaire_views_response_fields)
        }
        for questionnaire in parsed_questionnaire_list
    ]

    response = {"total": questionnaires_count, "data": questionnaires}

    return Response(response, status=status.HTTP_200_OK)
