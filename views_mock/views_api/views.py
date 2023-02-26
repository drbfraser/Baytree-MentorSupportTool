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
def get_staff_associations(request, staffId):
  # Note that if the staff has a single association, the object is not wrapped in a list
  # Otherwise, associations is a list
  root = Element('staff', {
    "id": "7"
  })
  associations = SubElement(root, "associations")
  association = SubElement(associations, "associations", {"id": "3"})

  associationID = SubElement(association, "AssociationID")
  associationID.text = "3"

  masterType = SubElement(association, "MasterType")
  masterType.text = "Person"

  masterId = SubElement(association, "MasterID")
  masterId.text = "5"

  slaveType = SubElement(association, "SlaveType")
  slaveType.text = "Staff"

  slaveId = SubElement(association, "SlaveID")
  slaveId.text = "7"

  associationField = SubElement(association, "Association")
  associationField.text = "Mentee"

  description = SubElement(association, "Description")

  startDate = SubElement(association, "StartDate")
  startDate.text = "2021-06-15"

  endDate = SubElement(association, "EndDate")
  endDate.text = "0000-00-00"

  created = SubElement(association, "Created")
  created.text = "2021-09-24 12:47:06"

  createdBy = SubElement(association, "CreatedBy")
  createdBy.text = "group.customer"

  updated = SubElement(association, "Updated")
  updated.text = "2021-11-05 01:07:27"

  updatedBy = SubElement(association, "UpdatedBy")
  updatedBy.text = "group.earth"

  return Response(tostring(root), 200)

@api_view(("GET",))
@permission_classes([AdminPermissions | MentorPermissions])
def search_participants_endpoint(request):
  personIds = request.GET.getlist('PersonID[]', [])

  root = Element("contacts")
  participants = SubElement(root, "participants", {"count": "1"})

  participant = SubElement(participants, "participant", {"id": "5408"})

  forename = SubElement(participant, "Forename")
  forename.text = "Anonymous"

  surname = SubElement(participant, "Surname")
  surname.text = "Person 3"

  personId = SubElement(participant, "PersonID")
  personId.text = "Anonymous"

  email = SubElement(participant, "Email")
  email.text = "test@gmail.com"

  dateOfBirth = SubElement(participant, "DateOfBirth")
  dateOfBirth.text = "2022-10-16"

  ethnicity = SubElement(participant, "Ethnicity")
  ethnicity.text = "Other ethnic group"

  county = SubElement(participant, "County")
  county.text = "Hampshire"

  firstLanguage = SubElement(participant, "FirstLanguage_P_88")

  return Response(tostring(root), 200)

@api_view(("GET",))
@permission_classes([AdminPermissions | MentorPermissions])
def search_participant_by_id_endpoint(request, menteeId):
  
  data = {
    "RestrictedRecord": "0",
    "LSOA": "E01004750",
    "QuestionnaireAnswerLink": "/questionnaires/external/login.php?uid=PVA1NDA4LEEzOTY0LFFb",
    "Referral_P_34": "",
    "Department_P_33": "Youth",
    "Adviser_P_211": "",
    "Status_P_219": "",
    "Intensity_P_220": "",
    "Focus_P_221": "",
    "Forename": "Anonymous",
    "Surname": "Person 3",
    "Nickname": "",
    "Age": "119",
    "DateOfBirth": "2022-10-16",
    "Estimated_P_217": "No",
    "Address1": "test town",
    "Address2": "",
    "Town": "",
    "County": "Hampshire",
    "Postcode": "SW1W 0NY",
    "Ward": "E05000647",
    "LADCUA": "E09000033",
    "Telephone": "",
    "Telnowork_P_35": "",
    "Mobile": "421345646",
    "Email": "test@gmail.com",
    "Contactdetailsof_P_218": "",
    "EmergencyContact1FirstName_P_206": "test",
    "EmergencyContact1LastName_P_207": "test",
    "Telnohome_P_45": "",
    "Telnowork_P_46": "",
    "Telnomobile_P_47": "test",
    "EmergencyContact1Email_P_208": "",
    "Relationship_P_44": "test",
    "ParentCarerFirstName_P_160": "",
    "ParentCarerLastName_P_161": "",
    "ParentCarerTelno_P_159": "",
    "ParentCarerEmail_P_157": "",
    "Relationshiptochild__P_158": "",
    "Shewillmakeherownway_P_169": "Yes",
    "Yourdaughterwillbecollectedby_P_168": "",
    "2Personrelationshipandcontactnumberofpersonauthorised_P_229": "",
    "Notes_P_210": "",
    "Specificrequirementsrelevanttoaccessingourservice_P_230": "None",
    "SpecificrequirementsrelevanttoaccessingourserviceOtherm_P_231": "",
    "Speechlanguageandcommunication_P_232": "",
    "SpeechlanguageandcommunicationOtherCommunicationneeds_P_233": "",
    "Doanyofyourfamilymembershaveanymedicalandemotionalcon_P_239": "",
    "Physicalhealthconditions_P_234": "",
    "PhysicalhealthconditionsOtherphysicalconditionswemaynee_P_235": "",
    "Doanyofyourfamilymembershaveanymedicalandemotionalcon_P_238": "",
    "Medicalandemotionalhealth_P_236": "",
    "MedicalandemotionalhealthOthermedicalconditionsweneedt_P_237": "",
    "MedicalandemotionalhealthAllergiespleasespecify_P_240": "",
    "Doanyofyourfamilymembershaveanymedicalissues_P_227": "",
    "GPName_P_196": "",
    "GPTelno_P_198": "",
    "GPAddress_P_200": "",
    "GPPostcode_P_201": "",
    "YouthIneducation_P_162": "Out of school/college",
    "Educationstatus_P_68": "",
    "Yearofschoolcollege_P_70": "",
    "Nameofcurrentschoolcollege_P_69": "",
    "Coursestudied_P_71": "",
    "Countryofpreviouseducation_P_114": "",
    "Whatisyourcurrentemployementstatus_P_73": "",
    "Ifretirednotworkinghowlongfor_P_180": "",
    "Ifemployedjobtitle_P_75": "",
    "Ifworkinghowmanyhoursdoyouworkperweek_P_181": "",
    "Employmentcontracttype_P_179": "",
    "Doyoureceivefreeschoolmeals_P_83": "",
    "Ifyespleaseindicateallrelevantbenefits_P_63": "",
    "Gender": "F",
    "MaritalStatus_P_40": "",
    "Religion": "Christian: Roman Catholic",
    "Nationality_P_86": "Colombian",
    "Countryofbirth_P_87": "Colombia",
    "FirstLanguage_P_88": "Catalan",
    "Anyotherlanguages_P_39": "",
    "Ethnicity": "Other ethnic group",
    "Whatisyourimmigrationstatus_P_173": "",
    "Whendidyoucometoliveinthecountry_P_167": "2021-11-12",
    "Doyouhavedependants_P_182": "",
    "DoyouhavecaringresponsibilitiesPleasedescribe_P_228": "",
    "Lookedafter_P_241": "",
    "Whishbestdescribesyourhousingsituation_P_170": "",
    "Whichbestdescribesyourlivingsituation_P_183": "",
    "YouthWhichbestdescribesyourlivingsituation_P_242": "",
    "Doyouhaveanycriminalconvictions_P_138": "",
    "Name_P_125": "",
    "Contactnumber_P_126": "",
    "Email_P_127": "",
    "Occupation_P_128": "",
    "Relationship_P_129": "",
    "Name_P_130": "",
    "Contactnumber_P_131": "",
    "Email_P_132": "",
    "Occupation_P_133": "",
    "Relationship_P_134": "",
    "Youngvolunteer_P_171": "",
    "VolunteerRole_P_135": "",
    "WheredidyoufindoutaboutvolunteeringatBaytree_P_140": "",
    "IfpartnerotherorganisationpleasespecifyVolunteering_P_204": "",
    "IfotherpleasespecifyVolunteering_P_205": "",
    "Mainreasonforvolunteering_P_141": "",
    "VolunteerStatus_P_146": "",
    "Startdate_P_212": "",
    "Enddate_P_213": "",
    "DisclosureDate_P_142": "",
    "RenewalDate_P_143": "",
    "DisclosureNumber_P_144": "",
    "WhatattractedyoutoBaytree_P_53": "Recommendation",
    "Ifotherpleasespecify_P_54": "",
    "WheredidyoulearnaboutBaytree_P_48": "Word of mouth|Friends / Family",
    "IfPartnerOtherorganisationpleasespecify_P_188": "",
    "IfOtherpleasespecify_P_189": "",
    "DoesafamilymemberattendactivitiesatBaytree_P_184": "",
    "PrivacyNoticeHowweuseyourpersonalinformation_P_215": "Yes",
    "Youagreetobecontactedbythefollowingmethods_P_216": "",
    "DoyougiveBaytreepermissiontouseyourimageinphotographs_P_223": "",
    "bfunderreporting_P_224": "Yes",
    "cresearch_P_225": "",
    "Numberofadultsfemale_P_55": "",
    "Numberofadultsmale_P_56": "",
    "Numberofchildrenfemale_P_57": "1",
    "Numberofchildrenmales_P_58": "",
    "Anonymised": "0000-00-00 00:00:00",
    "AnonymisedBy": "",
    "Created": "0000-00-00 00:00:00",
    "BlacklistedBy": "",
    "Blacklisted": "0000-00-00 00:00:00",
    "CreatedBy": "margaret.brown",
    "Updated": "2022-10-24 21:04:42",
    "UpdatedBy": "group.jupiter",
    "ArchivedBy": "",
    "Archived": "0000-00-00 00:00:00",
    "lastSeen": "0000-00-00",
    "Type": "1",
    "PersonID": "5408",
    "TypeName": "participant"
  }

  return Response(data, 200)