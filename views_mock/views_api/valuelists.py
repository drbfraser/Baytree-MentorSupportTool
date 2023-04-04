from users.permissions import MentorPermissions
from users.permissions import AdminPermissions
from rest_framework.decorators import permission_classes, api_view
from rest_framework.response import Response
from admin_valuelists.models import ValueList, ValueListItem
from xml.etree.ElementTree import Element, SubElement, tostring
from django.db.models.manager import BaseManager

@api_view(("GET",))
@permission_classes([AdminPermissions | MentorPermissions])
def get_valuelists_by_id_endpoint(request, valueListID):
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
def get_valuelists_type_name_endpoint(request, typeOfValueList: str, name: str):

  if request.META["HTTP_ACCEPT"] == "application/json":
    jsonResponseRequired = True
  else:
    jsonResponseRequired = False

  try:
    valueList = ValueList.objects.get(Type=typeOfValueList.lower(), Name=name.lower())
  except Exception as e:
    print(f"Exception: {e}")
    if jsonResponseRequired:
      data = {}
    else:
      data = tostring(Element('valuelist'))
    return Response(data, status=404)
  
  valueListItems = ValueListItem.objects.filter(valueList=valueList.ValueListID)

  if jsonResponseRequired:
    data = getJsonValueListData(valueListItems)
  else:
    data = getXMLValueListData(valueListItems)

  return Response(data, status=200)

def getJsonValueListData(valueListItems: BaseManager[ValueListItem]):
  data = {}
  items = {}

  for item in valueListItems:
    items[item.value] = item.value

  data["items"] = items
  return data

def getXMLValueListData(valueListItems: BaseManager[ValueListItem]):
  root = Element('valuelist')
  items = SubElement(root, "items")

  for item in valueListItems:
    element = SubElement(items, "item", {"id": str(item.pk)})
    element.text = item.value

  return tostring(root)