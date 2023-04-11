from users.permissions import MentorPermissions
from users.permissions import AdminPermissions
from rest_framework.decorators import permission_classes, api_view
from rest_framework.response import Response
from admin_valuelists.models import ValueList, ValueListItem
from django.db.models.manager import BaseManager

@api_view(("GET",))
@permission_classes([AdminPermissions | MentorPermissions])
def get_valuelists_by_id(request, valueListID):
  try:
    valueList = ValueList.objects.get(ValueListID=valueListID)
  except Exception as e:
    print(f"Exception: {e}")
    return Response({}, status=404)
  
  valueListItems = ValueListItem.objects.filter(valueList=valueList.ValueListID)

  data = getJsonValueListData(valueListItems)

  return Response(data, 200)

@api_view(("GET",))
@permission_classes([AdminPermissions | MentorPermissions])
def get_valuelists_by_type_and_name(request, typeOfValueList: str, name: str):

  try:
    valueList = ValueList.objects.get(Type=typeOfValueList.lower(), Name=name.lower())
  except Exception as e:
    print(f"Exception: {e}")
    return Response({}, status=200)
  
  valueListItems = ValueListItem.objects.filter(valueList=valueList.ValueListID)

  data = getJsonValueListData(valueListItems)

  return Response(data, status=200)

def getJsonValueListData(valueListItems: BaseManager[ValueListItem]):
  data = {}
  items = {}

  for item in valueListItems:
    items[item.value] = item.value

  data["items"] = items
  return data