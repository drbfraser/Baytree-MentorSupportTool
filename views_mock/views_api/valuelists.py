from users.permissions import MentorPermissions
from users.permissions import AdminPermissions
from rest_framework.decorators import permission_classes, api_view
from rest_framework.response import Response
from admin_valuelists.models import ValueList, ValueListItem
from xml.etree.ElementTree import Element, SubElement, tostring

@api_view(("GET",))
@permission_classes([AdminPermissions | MentorPermissions])
def get_valuelists_endpoint(request, valueListID):
  data = {}
  items = {}

  try:
    valueList = ValueList.objects.get(ValueListID=valueListID)
  except Exception as e:
    print(f"Exception: {e}")
    return Response(data, status=404)
  
  populateObjectWithValueListItems(items, valueList.ValueListID)

  data["items"] = items

  return Response(data, 200)

@api_view(("GET",))
@permission_classes([AdminPermissions | MentorPermissions])
def get_volunteering_types_endpoint(request):
  data = {}
  items = {}

  try:
    valueList = ValueList.objects.get(Type=ValueList.TypeEnum.SESSION_GROUP.value, Name=ValueList.NameEnum.VOLUNTEERING_TYPES.value)
  except Exception as e:
    print(f"Exception: {e}")
    return Response(data, status=404)
  
  populateObjectWithValueListItems(items, valueList.ValueListID)

  data["items"] = items

  return Response(data, status=200)

def populateObjectWithValueListItems(containingObject, id):
  valueItems = ValueListItem.objects.filter(valueList=id)
  for item in valueItems:
    containingObject[item.value] = item.value

@api_view(("GET",))
@permission_classes([AdminPermissions | MentorPermissions])
def get_venues_endpoint(request):

  root = Element('valuelist')
  items = SubElement(root, "items")

  try:
    valueList = ValueList.objects.get(Type=ValueList.TypeEnum.SESSION_GROUP.value, Name=ValueList.NameEnum.VENUES.value)
  except Exception as e:
    print(f"Exception: {e}")
    return Response(tostring(root), status=404)
  
  valueListItems = ValueListItem.objects.filter(valueList=valueList.ValueListID)

  for venueItem in valueListItems:
    item = SubElement(items, "item", {"id": str(venueItem.pk)})
    item.text = venueItem.value
  
  return Response(tostring(root), 200)

@api_view(("GET",))
@permission_classes([AdminPermissions | MentorPermissions])
def get_activities_endpoint(request):
  data = {}
  items = {}

  try:
    valueList = ValueList.objects.get(Type=ValueList.TypeEnum.SESSION_GROUP.value, Name=ValueList.NameEnum.AGENCY_ACTIVITIES.value)
  except Exception as e:
    print(f"Exception: {e}")
    return Response(data, status=404)
  
  populateObjectWithValueListItems(items, valueList.ValueListID)

  data["items"] = items

  return Response(data, status=200)