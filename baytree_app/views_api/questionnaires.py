from rest_framework.response import Response

from .util import get_views_record_count_json
from .constants import views_base_url
from rest_framework.decorators import permission_classes, api_view
from rest_framework import status
from users.permissions import AdminPermissions
import requests
import json

questionnaires_search_url = views_base_url + "evidence/questionnaires/search.json"
questionnaires_id_url = views_base_url + "evidence/questionnaires/{}.json"

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
def get_questionnaires_endpoint(request, headers):
    """
    Controller that handles a request from the client browser and calls
    get_questionnaires to return its response to the client.
    """
    id = request.GET.get("id", None)

    if id != None:
        response = get_questionnaires(id, headers)
        if not response:
            return Response("Not Found", status=status.HTTP_404_NOT_FOUND)
    else:
        # Convert strings to integers
        limit = request.GET.get("limit", None)
        limit = int(limit) if limit != None else None

        offset = request.GET.get("offset", None)
        offset = int(offset) if offset != None else None

        response = get_questionnaires(
            headers=headers,
            limit=limit,
            offset=offset,
            title=request.GET.get("title", None),
        )

    return Response(response, status=status.HTTP_200_OK)


MAX_QUESTIONNAIRES_PAGE_SIZE = 100


def get_questionnaires(
    id: int = None,
    headers: str = '',
    limit: int = None,
    offset: int = None,
    title: str = None,
):
    # limit page size to prevent out of memory errors returned from Views
    if limit == None or limit > MAX_QUESTIONNAIRES_PAGE_SIZE:
        limit = MAX_QUESTIONNAIRES_PAGE_SIZE

    if id != None:
        views_response = requests.get(
            questionnaires_id_url.format(id),
            headers,
        )

        if views_response.status_code != 200:
            return None

        parsed_questionnaire = json.loads(views_response.text)
        translated_questionnaire = translate_questionnaire(parsed_questionnaire)
        return translated_questionnaire

    else:
        request_url = f"{questionnaires_search_url}?"
        if limit != None:
            request_url += f"&pageFold={limit}"
        if offset != None:
            request_url += f"&offset={offset}"
        if title != None:
            request_url += f"&Title={title}"

        views_response = requests.get(
            request_url,
            headers=headers,
        )

    parsedJson = json.loads(views_response.text)

    parsedQuestionnaires = []

    for questionnaires in parsedJson.items():
        if not questionnaires[1]:
            # no results were returned, stop parsing before error
            break

        for questionnaire in questionnaires[1].items():
            parsedQuestionnaires.append(questionnaire[1])

    translatedQuestionnaires = [
        translate_questionnaire(parsed_questionnaire)
        for parsed_questionnaire in parsedQuestionnaires
    ]

    response = {
        "total": get_views_record_count_json(parsedJson),
        "data": translatedQuestionnaires,
    }

    return response


def translate_questionnaire(parsed_questionnaire):
    return {
        questionnaire_translated_fields[i]: int(parsed_questionnaire[field])
        if field == "QuestionnaireID"
        else parsed_questionnaire[field]
        for i, field in enumerate(questionnaire_views_response_fields)
    }
