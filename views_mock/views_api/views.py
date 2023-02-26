from rest_framework.decorators import permission_classes, api_view
from rest_framework.response import Response
from xml.etree.ElementTree import Element, SubElement, tostring
from users.permissions import AdminPermissions, MentorPermissions

@api_view(("GET",))
@permission_classes([AdminPermissions | MentorPermissions])
def get_volunteering_types_endpoint(request):

  data = {
        "items": {
          "volunteer_types": [
              {"id": 1, "type_name": "Community Service"},
              {"id": 2, "type_name": "Environmental Work"},
              {"id": 3, "type_name": "Animal Care"},
          ]
        }
    }
  return Response(data, 200)

@api_view(("GET",))
@permission_classes([AdminPermissions | MentorPermissions])
def get_venues_endpoint(request):

  root = Element('valuelist', {
    "id": "43",
    "items": "10",
    "archived-items": "5"
  })
  valueListId = SubElement(root, "valueListId")
  valueListId.text = "43"

  sourceId = SubElement(root, "SourceID")

  type = SubElement(root, "Type")
  type.text = "SessionGroup"

  name = SubElement(root, "Name")
  name.text = "Venues"

  displayName = SubElement(root, "DisplayName")
  displayName.text = "Venues"

  system = SubElement(root, "System")
  system.text = "1"

  calculated = SubElement(root, "Calculated")
  calculated.text = "1"

  extendable = SubElement(root, "Extendable")
  extendable.text = "0"

  active = SubElement(root, "Active")
  active.text = "1"

  alphabetical = SubElement(root, "Alphabetical")
  alphabetical.text = "0"

  # Items
  items = SubElement(root, "items")

  item1 = SubElement(items, "item", {"id": "6"})
  item1.text = "Baytree Centre"

  item2 = SubElement(items, "item", {"id": "4"})
  item2.text = "Jupiter Venue"

  item3 = SubElement(items, "item", {"id": "3"})
  item3.text = "Sfu Surrey"

  item4 = SubElement(items, "item", {"id": "2"})
  item4.text = "Some Venue"

  item5 = SubElement(items, "item", {"id": "5"})
  item5.text = "Virtual"

  count = SubElement(root, "count")
  count.text = "10"

  archivedItems = SubElement(root, "archivedItems")
  archivedItems.text = "5"
  return Response(tostring(root), 200)