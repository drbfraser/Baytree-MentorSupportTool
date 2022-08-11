from rest_framework.response import Response
from .constants import views_base_url, views_username, views_password
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
def get_questionnaires_endpoint(request):
    """
    Controller that handles a request from the client browser and calls
    get_questionnaires to return its response to the client.
    """
    id = request.GET.get("id", None)

    if id != None:
        response = get_questionnaires(id)
        if not response:
            return Response("Not Found", status=status.HTTP_404_NOT_FOUND)
    else:
        response = get_questionnaires(
            limit=request.GET.get("limit", None),
            offset=request.GET.get("offset", None),
            title=request.GET.get("title", None),
        )

    return Response(response, status=status.HTTP_200_OK)


MAX_QUESTIONNAIRES_PAGE_SIZE = 200


def get_questionnaires(
    id: int = None,
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
            auth=(views_username, views_password),
        )

        if views_response.status_code != 200:
            return None

        parsed_questionnaire = json.loads(views_response.text)

        translated_questionnaire = {
            questionnaire_translated_fields[i]: int(parsed_questionnaire[field])
            if field == "QuestionnaireID"
            else parsed_questionnaire[field]
            for i, field in enumerate(questionnaire_views_response_fields)
        }

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
            auth=(views_username, views_password),
        )

    parsedJson = json.loads(views_response.text)

    parsedQuestionnaires = []

    for questionnaires in parsedJson.items():
        if not questionnaires[1]:
            # no results were returned, stop parsing before error
            break

        # get total number of records in views (non-page size)
        trim_before_count = questionnaires[0][questionnaires[0].index("count") + 7 :]
        trim_after_count = trim_before_count[: trim_before_count.index('"')]
        total = int(trim_after_count)

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
        "total": total,
        "data": translatedQuestionnaires,
    }

    return response
