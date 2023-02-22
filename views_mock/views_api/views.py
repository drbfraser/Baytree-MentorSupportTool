from rest_framework.decorators import permission_classes, api_view
from rest_framework.response import Response

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
@permission_classes([AdminPermissions])
def get_session_group_by_id_endpoint(request, sessionGroupId):
  data = {
    "Title": "Literacy Junior",
    "Created": "2014-09-24 15:43:55",
    "CreatedBy": "caroline.guarnaccia",
    "Updated": "2014-10-28 11:00:20",
    "UpdatedBy": "caroline.guarnaccia",
    "Archived": "2022-01-14 15:15:15",
    "ArchivedBy": "matthew.croston.transit",
    "RegisterGroupings": "",
    "RestrictedRecord": "1",
    "Type": "Individual",
    "Programmes": "",
    "Projects": "1",
    "BookingMode": "None",
    "AllowSessionTypes": "Session|Event",
    "Description": "To provide afterschool support for girls in years 5-6 who need some additional help with academic work",
    "LeadStaff": "12",
    "OtherStaff": "",
    "VenueID": "1",
    "YouthThemes_SG_35": "",
    "Womensthemes_SG_36": "",
    "StartDate": "2014-09-15",
    "EndDate": "2014-12-22",
    "PlannedSessions": "15",
    "AgeGroupFrom": "9",
    "AgeGroupTo": "10",
    "NumberOfPlaces": "0",
    "ParticipantQuestionnaireID": "",
    "SessionQuestionnaireID": "",
    "Project_SG_32": "",
    "Funder_SG_37": "",
    "YouthFunder_Sessiongroup_38": "",
    "SessionGroupID": str(sessionGroupId),
    "sessionCount": "12",
    "pastSessionCount": "12",
    "futureSessionCount": "0",
    "SessionsBeforeDate": "12",
    "SessionsAfterDate": "0",
    "SessionsOnDate": "0",
    "QuestionnaireCountSession": 0,
    "QuestionnaireCountParticipant": 0,
    "QuestionnaireCount": 0,
    "registerCount": "1",
    "TypeName": "sessiongroup"
  }
  return Response(data, 200)

@api_view(("GET",))
@permission_classes([AdminPermissions])
def search_session_groups_endpoint(request):
  pageFold = request.GET.get('pageFold', 2)
  offset = request.GET.get('offset', 0)
  title = request.GET.get('Title', '')

  # Note that pageSize changes with pageFold
  data = {
    "sessiongroups count=\"1868\" pagesize=\"2\"": {
      "sessiongroup id=\"153\"": {
        "Title": "Into School 2014-2015",
        "Created": "2015-02-26 10:39:09",
        "CreatedBy": "emily.reddon",
        "Updated": "2015-02-26 10:39:09",
        "UpdatedBy": "emily.reddon",
        "Archived": "2022-01-14 15:15:15",
        "ArchivedBy": "matthew.croston.transit",
        "RegisterGroupings": "",
        "RestrictedRecord": "0",
        "Type": "Individual",
        "Programmes": "",
        "Projects": "4",
        "BookingMode": "None",
        "AllowSessionTypes": "Session|Event",
        "Description": "Immigrant girls aged 12-19 without a school place can access ESOL and one to one mentoring support to help find a school place.",
        "LeadStaff": "16",
        "OtherStaff": "",
        "VenueID": "1",
        "YouthThemes_SG_35": "",
        "Womensthemes_SG_36": "",
        "StartDate": "0000-00-00",
        "EndDate": "0000-00-00",
        "PlannedSessions": "0",
        "AgeGroupFrom": "0",
        "AgeGroupTo": "0",
        "NumberOfPlaces": "0",
        "ParticipantQuestionnaireID": "",
        "SessionQuestionnaireID": "",
        "Project_SG_32": "",
        "Funder_SG_37": "",
        "YouthFunder_Sessiongroup_38": "",
        "SessionGroupID": "153",
        "registerCount": "0",
        "TypeName": "sessiongroup"
      },
      "sessiongroup id=\"965\"": {
        "Title": "Assessment and registration 2018 - 2019",
        "Created": "2018-08-16 14:48:31",
        "CreatedBy": "margaret.brown",
        "Updated": "2018-08-16 15:04:33",
        "UpdatedBy": "margaret.brown",
        "Archived": "2022-01-14 15:15:15",
        "ArchivedBy": "matthew.croston.transit",
        "RegisterGroupings": "",
        "RestrictedRecord": "0",
        "Type": "Individual",
        "Programmes": "0",
        "Projects": "2|10",
        "BookingMode": "None",
        "AllowSessionTypes": "Session",
        "Description": "Assessment and/or registration session for students enquiring about courses.",
        "LeadStaff": "9",
        "OtherStaff": "",
        "VenueID": "1",
        "YouthThemes_SG_35": "",
        "Womensthemes_SG_36": "",
        "StartDate": "0000-00-00",
        "EndDate": "0000-00-00",
        "PlannedSessions": "0",
        "AgeGroupFrom": "0",
        "AgeGroupTo": "0",
        "NumberOfPlaces": "0",
        "ParticipantQuestionnaireID": "",
        "SessionQuestionnaireID": "",
        "Project_SG_32": "",
        "Funder_SG_37": "",
        "YouthFunder_Sessiongroup_38": "",
        "SessionGroupID": "965",
        "registerCount": "0",
        "TypeName": "sessiongroup"
      }
    }
  }
  return Response(data, 200)