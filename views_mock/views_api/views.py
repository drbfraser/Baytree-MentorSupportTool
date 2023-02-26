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
def get_activities_endpoint(request):
  data = {
    "items": {
        "item id=\"Academic One to One \"": "Academic One to One",
        "item id=\"Advocating on beneficiary's behalf\"": "Advocating on beneficiary's behalf",
        "item id=\"Befriending\"": "Befriending",
        "item id=\"Better off calculation\"": "Better off calculation",
        "item id=\"Brexit Support\"": "Brexit Support",
        "item id=\"Budgeting\"": "Budgeting",
        "item id=\"Case discussion\"": "Case discussion",
        "item id=\"Case research\"": "Case research",
        "item id=\"Character education session\"": "Character education session",
        "item id=\"Christmas party\"": "Christmas party",
        "item id=\"Cultural Visit\"": "Cultural Visit",
        "item id=\"Discounted travel\"": "Discounted travel",
        "item id=\"Distributing Food\"": "Distributing Food",
        "item id=\"Drama\"": "Drama",
        "item id=\"ESOL Saturdays\"": "ESOL Saturdays",
        "item id=\"ESOL Whatsapp chats\"": "ESOL Whatsapp chats",
        "item id=\"ESOL class\"": "ESOL class",
        "item id=\"Email contact \"": "Email contact",
        "item id=\"Emotional Intelligence Session\"": "Emotional Intelligence Session",
        "item id=\"English conversation\"": "English conversation",
        "item id=\"Event\"": "Event",
        "item id=\"Exhibition\"": "Exhibition",
        "item id=\"Film\"": "Film",
        "item id=\"Finance (identify income and outgoing)\"": "Finance (identify income and outgoing)",
        "item id=\"Finance assessment (assess if have debts, priority debts and non-priority debts)\"": "Finance assessment (assess if have debts, priority debts and non-priority debts)",
        "item id=\"Flipgrid\"": "Flipgrid",
        "item id=\"Form Filling \"": "Form Filling",
        "item id=\"Free employment provision\"": "Free employment provision",
        "item id=\"Free health care provision\"": "Free health care provision",
        "item id=\"Free school meals application\"": "Free school meals application",
        "item id=\"Group\"": "Group",
        "item id=\"Homework support \"": "Homework support",
        "item id=\"Housing\"": "Housing",
        "item id=\"IT\"": "IT",
        "item id=\"Impromptu meeting\"": "Impromptu meeting",
        "item id=\"Information, Advice and Guidance\"": "Information, Advice and Guidance",
        "item id=\"Internship\"": "Internship",
        "item id=\"Interpreting / Translating\"": "Interpreting / Translating",
        "item id=\"Into School mentoring\"": "Into School mentoring",
        "item id=\"Into School programme\"": "Into School programme",
        "item id=\"Issue food bank voucher\"": "Issue food bank voucher",
        "item id=\"Laptop Loan\"": "Laptop Loan",
        "item id=\"Legacy benefits\"": "Legacy benefits",
        "item id=\"Liaise with GP\"": "Liaise with GP",
        "item id=\"Managing family funds\"": "Managing family funds",
        "item id=\"Massage session\"": "Massage session",
        "item id=\"Mathletics\"": "Mathletics",
        "item id=\"Meeting Representation\"": "Meeting Representation",
        "item id=\"Money Champions\"": "Money Champions",
        "item id=\"Moved to one to one support\"": "Moved to one to one support",
        "item id=\"New Referral Sign Up\"": "New Referral Sign Up",
        "item id=\"No recourse to public fund\"": "No recourse to public fund",
        "item id=\"Nutritional Workshop\"": "Nutritional Workshop",
        "item id=\"One to one\"": "One to one",
        "item id=\"PE\"": "PE",
        "item id=\"Party\"": "Party",
        "item id=\"Phone call\"": "Phone call",
        "item id=\"Referrals & liaison to other agencies\"": "Referrals & liaison to other agencies",
        "item id=\"Refugee Week Celebration\"": "Refugee Week Celebration",
        "item id=\"Renewal of ID for Welfare purpose\"": "Renewal of ID for Welfare purpose",
        "item id=\"Riding lesson\"": "Riding lesson",
        "item id=\"SMS and Whatsapp Messaging\"": "SMS and Whatsapp Messaging",
        "item id=\"Saturday cookery class \"": "Saturday cookery class",
        "item id=\"Schemes, grants and social funds\"": "Schemes, grants and social funds",
        "item id=\"School trip\"": "School trip",
        "item id=\"Self-Confidence Workshop\"": "Self-Confidence Workshop",
        "item id=\"Stress and time management\"": "Stress and time management",
        "item id=\"Theatre\"": "Theatre",
        "item id=\"Third party referral of Beneficiary with NRPF\"": "Third party referral of Beneficiary with NRPF",
        "item id=\"Trip\"": "Trip",
        "item id=\"Universal credit\"": "Universal credit",
        "item id=\"University application / personal statement support\"": "University application / personal statement support",
        "item id=\"Video call\"": "Video call",
        "item id=\"Volunteer one to one support\"": "Volunteer one to one support",
        "item id=\"Volunteering\"": "Volunteering",
        "item id=\"Walk in local \"Food bank\" collection \"": "Walk in local \"Food bank\" collection",
        "item id=\"Welfare & Benefit Online application\"": "Welfare & Benefit Online application",
        "item id=\"Wellbeing check in\"": "Wellbeing check in",
        "item id=\"Winter Clothing Donation\"": "Winter Clothing Donation",
        "item id=\"Women's remote support\"": "Women's remote support",
        "item id=\"Women's support\"": "Women's support",
        "item id=\"Workshop\"": "Workshop",
        "item id=\"Write statement\"": "Write statement",
        "item id=\"Youth mentoring\"": "Youth mentoring",
        "item id=\"Youtube engagement\"": "Youtube engagement"
    },
    "count": 107,
    "archivedItems": 22
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
