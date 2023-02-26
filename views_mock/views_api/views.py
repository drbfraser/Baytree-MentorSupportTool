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
@permission_classes([AdminPermissions])
def get_questionnaire_by_id_endpoint(request, questionnaireId: int):
  data = {
    "QuestionnaireID": str(questionnaireId),
    "Title": "All: Covid-19 Diary",
    "Description": "This is for managers and/or practitioners to share updates on their department in response to Covid-19 on a weekly basis.",
    "Created": "2020-05-05 11:08:50",
    "Updated": "2021-03-12 19:27:32",
    "CreatedBy": "suching.lee",
    "UpdatedBy": "joyce.castaneda"
  }
  return Response(data, 200)



@api_view(("GET",))
@permission_classes([AdminPermissions])
def search_questionnaires_endpoint(request):
  # Will make use of these once MySQL database is connected
  pageFold = request.GET.get("pageFold", 0)
  offset = request.GET.get("offset", 0)
  title = request.GET.get("Title", "")

  data = {
    "questionnaires count=\"74\"": {
        "questionnaire id=\"133\"": {
            "QuestionnaireID": "133",
            "Title": "All: Covid-19 Diary",
            "SourceID": None,
            "Description": "This is for managers and/or practitioners to share updates on their department in response to Covid-19 on a weekly basis.",
            "Created": "2020-05-05 11:08:50",
            "Updated": "2021-03-12 19:27:32",
            "CreatedBy": "suching.lee",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"132\"": {
            "QuestionnaireID": "132",
            "Title": "All: Needs assessment during Covid 19",
            "SourceID": None,
            "Description": "",
            "Created": "2020-03-27 18:35:28",
            "Updated": "2021-03-12 19:28:08",
            "CreatedBy": "joyce.castaneda",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"154\"": {
            "QuestionnaireID": "154",
            "Title": "Communications Monitoring",
            "SourceID": None,
            "Description": "Monitoring Twitter, Facebook, Instragram, website and e-newsletters.",
            "Created": "2021-05-05 15:52:28",
            "Updated": "2021-05-05 15:52:28",
            "CreatedBy": "joyce.castaneda",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"121\"": {
            "QuestionnaireID": "121",
            "Title": "External bookings of Baytree facilities",
            "SourceID": None,
            "Description": "Registration of external bookings to be able to get the number of organisations and people who use Baytree's facilities",
            "Created": "2019-11-01 17:08:56",
            "Updated": "2019-11-01 17:08:56",
            "CreatedBy": "joyce.castaneda",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"117\"": {
            "QuestionnaireID": "117",
            "Title": "IS: ILP and Post questionnaire",
            "SourceID": None,
            "Description": "Individual learning plan including the pre and post questionnaires for Into School girls. The scale used for the statements are: 1 - strongly disagree, 2 - disagree, 3 - not sure, 4 - agree, and 5 - strongly agree.",
            "Created": "2019-10-22 15:50:38",
            "Updated": "2021-03-12 19:34:23",
            "CreatedBy": "joyce.castaneda",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"99\"": {
            "QuestionnaireID": "99",
            "Title": "IS: Young women who got into school, university, college or work",
            "SourceID": None,
            "Description": "Into school girls who were able to get into (a) school, college or university or (b) work",
            "Created": "2019-02-05 10:52:47",
            "Updated": "2021-03-12 19:46:32",
            "CreatedBy": "joyce.castaneda",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"155\"": {
            "QuestionnaireID": "155",
            "Title": "Monthly Mentoring Report",
            "SourceID": None,
            "Description": "",
            "Created": "2021-06-07 14:27:44",
            "Updated": "2021-06-07 14:27:44",
            "CreatedBy": "angela.parkes",
            "UpdatedBy": "angela.parkes"
        },
        "questionnaire id=\"140\"": {
            "QuestionnaireID": "140",
            "Title": "Nathalia Volquez",
            "SourceID": None,
            "Description": "Esol Class  Speak no English",
            "Created": "2020-12-14 15:54:39",
            "Updated": "2020-12-14 15:54:39",
            "CreatedBy": "sonia.pollock",
            "UpdatedBy": "sonia.pollock"
        },
        "questionnaire id=\"141\"": {
            "QuestionnaireID": "141",
            "Title": "Quenia Novas",
            "SourceID": None,
            "Description": "EsolClass This lady coud not speak english",
            "Created": "2020-12-14 16:21:57",
            "Updated": "2020-12-14 16:21:57",
            "CreatedBy": "sonia.pollock",
            "UpdatedBy": "sonia.pollock"
        },
        "questionnaire id=\"142\"": {
            "QuestionnaireID": "142",
            "Title": "Quenia Novas",
            "SourceID": None,
            "Description": "ESOL Class this lady could speak no english",
            "Created": "2020-12-14 16:26:48",
            "Updated": "2020-12-14 16:26:48",
            "CreatedBy": "sonia.pollock",
            "UpdatedBy": "sonia.pollock"
        },
        "questionnaire id=\"78\"": {
            "QuestionnaireID": "78",
            "Title": "Reception: Enquiries",
            "SourceID": None,
            "Description": "",
            "Created": "2018-06-18 10:34:31",
            "Updated": "2021-08-12 14:13:56",
            "CreatedBy": "joyce.castaneda",
            "UpdatedBy": "federica.saez"
        },
        "questionnaire id=\"184\"": {
            "QuestionnaireID": "184",
            "Title": "test",
            "SourceID": None,
            "Description": "",
            "Created": "2022-10-24 23:49:18",
            "Updated": "2022-11-13 04:54:58",
            "CreatedBy": "group.andrew",
            "UpdatedBy": "group.andrew"
        },
        "questionnaire id=\"185\"": {
            "QuestionnaireID": "185",
            "Title": "test (Copy)",
            "SourceID": None,
            "Description": "",
            "Created": "2022-11-14 09:07:59",
            "Updated": "2022-11-14 09:07:59",
            "CreatedBy": "group.andrew",
            "UpdatedBy": "group.andrew"
        },
        "questionnaire id=\"156\"": {
            "QuestionnaireID": "156",
            "Title": "VS: 1 to 1 Support Call Log",
            "SourceID": None,
            "Description": "Volunteer log for their one to one support call to women. For the scale: 0: Not discussed, 1: Significant decline, 2: Some decline, 3: No change, 4: Some improvement, and 5: Significant improvement",
            "Created": "2021-07-19 12:32:51",
            "Updated": "2021-07-19 14:09:44",
            "CreatedBy": "joyce.castaneda",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"161\"": {
            "QuestionnaireID": "161",
            "Title": "VS: 1 to 1 Support Call Log (new)",
            "SourceID": None,
            "Description": "",
            "Created": "2021-10-19 17:17:50",
            "Updated": "2021-10-19 17:31:10",
            "CreatedBy": "joyce.castaneda",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"131\"": {
            "QuestionnaireID": "131",
            "Title": "VS: Club Volunteer Evaluation Form (Youth)",
            "SourceID": None,
            "Description": "Use by the staff when having her one to one with club volunteer.",
            "Created": "2020-01-27 12:33:52",
            "Updated": "2021-03-12 19:28:52",
            "CreatedBy": "joyce.castaneda",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"64\"": {
            "QuestionnaireID": "64",
            "Title": "VS: Exit Questionnaire",
            "SourceID": None,
            "Description": "Feedback form from volunteers who are leaving Baytree",
            "Created": "2017-07-25 09:09:24",
            "Updated": "2021-03-12 19:59:42",
            "CreatedBy": "joyce.castaneda",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"176\"": {
            "QuestionnaireID": "176",
            "Title": "VS: Feedback and ideas",
            "SourceID": None,
            "Description": "Feedback and ideas by users gathered from the suggestion box, in activities or sessions or other means.",
            "Created": "2022-05-09 10:16:54",
            "Updated": "2022-05-09 10:17:12",
            "CreatedBy": "joyce.castaneda",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"79\"": {
            "QuestionnaireID": "79",
            "Title": "VS: Induction List",
            "SourceID": None,
            "Description": "Induction of volunteers",
            "Created": "2018-07-03 12:13:47",
            "Updated": "2021-03-12 19:55:30",
            "CreatedBy": "joyce.castaneda",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"62\"": {
            "QuestionnaireID": "62",
            "Title": "VS: Induction Process questionnaire",
            "SourceID": None,
            "Description": "To assess the following:a. communications before the induction b. induction process",
            "Created": "2017-06-26 17:22:14",
            "Updated": "2021-03-12 20:00:24",
            "CreatedBy": "joyce.castaneda",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"91\"": {
            "QuestionnaireID": "91",
            "Title": "VS: Mentoring Evaluation Form (Youth Services)",
            "SourceID": None,
            "Description": "",
            "Created": "2018-09-19 11:17:48",
            "Updated": "2021-03-12 19:39:48",
            "CreatedBy": "baytree.intern3",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"137\"": {
            "QuestionnaireID": "137",
            "Title": "VS: Mentoring Monthly Report",
            "SourceID": None,
            "Description": "Mentors fill this form every month which they submit to the mentor coordinator. The scale used is 1 to 5, 1 as Never and 5 as Always.",
            "Created": "2020-11-03 10:00:53",
            "Updated": "2021-03-12 19:29:15",
            "CreatedBy": "joyce.castaneda",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"130\"": {
            "QuestionnaireID": "130",
            "Title": "VS: One to one Evaluation Meeting Mentoring",
            "SourceID": None,
            "Description": "",
            "Created": "2020-01-23 13:14:22",
            "Updated": "2021-03-12 19:30:27",
            "CreatedBy": "joyce.castaneda",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"179\"": {
            "QuestionnaireID": "179",
            "Title": "VS: One to one supervision with volunteers",
            "SourceID": None,
            "Description": "Use by the staff when having her one to one with club volunteer.",
            "Created": "2022-05-19 11:53:53",
            "Updated": "2022-05-19 11:58:29",
            "CreatedBy": "joyce.castaneda",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"135\"": {
            "QuestionnaireID": "135",
            "Title": "VS: Online Mentors Interview",
            "SourceID": None,
            "Description": "Informal 121 interviews with new volunteers, following the Youth Mentor Training and prior to the mentoring matching.",
            "Created": "2020-09-07 13:10:22",
            "Updated": "2021-03-12 19:29:36",
            "CreatedBy": "federica.saez",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"123\"": {
            "QuestionnaireID": "123",
            "Title": "VS: Testimonials",
            "SourceID": None,
            "Description": "Written or verbal testimonials from the volunteers",
            "Created": "2019-11-08 21:12:34",
            "Updated": "2021-03-12 19:33:49",
            "CreatedBy": "joyce.castaneda",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"182\"": {
            "QuestionnaireID": "182",
            "Title": "VS: Volunteer Club/Activity Observation Sheet",
            "SourceID": None,
            "Description": "Use to observe club volunteers",
            "Created": "2022-06-16 10:39:18",
            "Updated": "2022-07-21 10:48:59",
            "CreatedBy": "joyce.castaneda",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"65\"": {
            "QuestionnaireID": "65",
            "Title": "VS: Volunteer Questionnaire",
            "SourceID": None,
            "Description": "",
            "Created": "2017-07-25 18:18:07",
            "Updated": "2021-03-12 19:59:21",
            "CreatedBy": "joyce.castaneda",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"82\"": {
            "QuestionnaireID": "82",
            "Title": "VS: Volunteer Training",
            "SourceID": None,
            "Description": "Summary of training offered to Baytree volunteers",
            "Created": "2018-07-10 12:10:37",
            "Updated": "2021-03-12 19:50:11",
            "CreatedBy": "joyce.castaneda",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"115\"": {
            "QuestionnaireID": "115",
            "Title": "VS: Women Mentor's Weekly Feedback",
            "SourceID": None,
            "Description": "Mentor's notes of what goes on during her mentoring for the month including the challenges she encounters.",
            "Created": "2019-10-15 12:56:12",
            "Updated": "2021-03-12 19:35:41",
            "CreatedBy": "joyce.castaneda",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"84\"": {
            "QuestionnaireID": "84",
            "Title": "VS: Women's Mentor Training Evaluation",
            "SourceID": None,
            "Description": "Training evaluation form for women mentors",
            "Created": "2018-09-04 11:03:44",
            "Updated": "2021-03-12 19:44:02",
            "CreatedBy": "joyce.castaneda",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"162\"": {
            "QuestionnaireID": "162",
            "Title": "VS: Workshop Evaluation",
            "SourceID": None,
            "Description": "Evaluation for volunteers following a Discussion Forum / Continued Development Workshop.",
            "Created": "2021-11-09 12:24:47",
            "Updated": "2021-11-09 12:26:08",
            "CreatedBy": "federica.saez",
            "UpdatedBy": "federica.saez"
        },
        "questionnaire id=\"172\"": {
            "QuestionnaireID": "172",
            "Title": "VS: Workshop Evaluation (for Cultural Awareness)",
            "SourceID": None,
            "Description": "Evaluation for volunteers following a Discussion Forum / Continued Development Workshop.",
            "Created": "2022-02-17 16:16:40",
            "Updated": "2022-02-17 16:17:48",
            "CreatedBy": "federica.saez",
            "UpdatedBy": "federica.saez"
        },
        "questionnaire id=\"153\"": {
            "QuestionnaireID": "153",
            "Title": "VS: Workshop Facilitator Registration",
            "SourceID": None,
            "Description": "",
            "Created": "2021-05-04 17:15:27",
            "Updated": "2021-05-06 10:23:51",
            "CreatedBy": "joyce.castaneda",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"143\"": {
            "QuestionnaireID": "143",
            "Title": "VS: Yearly Questionnaire",
            "SourceID": None,
            "Description": "Answered in June, but if volunteer leaves early, they answer this together with the exit questionnaire.",
            "Created": "2021-01-05 09:55:31",
            "Updated": "2021-03-18 17:18:24",
            "CreatedBy": "joyce.castaneda",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"136\"": {
            "QuestionnaireID": "136",
            "Title": "VS: Youth Mentor Monthly Progress Report",
            "SourceID": None,
            "Description": "",
            "Created": "2020-09-07 17:17:19",
            "Updated": "2021-03-12 19:30:02",
            "CreatedBy": "federica.saez",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"85\"": {
            "QuestionnaireID": "85",
            "Title": "VS: Youth Mentor Training Evaluation",
            "SourceID": None,
            "Description": "Training evaluation for youth mentors",
            "Created": "2018-09-04 11:21:54",
            "Updated": "2021-03-12 19:39:18",
            "CreatedBy": "joyce.castaneda",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"116\"": {
            "QuestionnaireID": "116",
            "Title": "VS: Youth Mentor's Weekly Feedback",
            "SourceID": None,
            "Description": "Mentor's notes of what goes on during her mentoring for the month including the challenges she encounters.",
            "Created": "2019-10-15 12:57:49",
            "Updated": "2021-03-12 19:36:08",
            "CreatedBy": "joyce.castaneda",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"181\"": {
            "QuestionnaireID": "181",
            "Title": "WS: Befriending & Mentoring Survey",
            "SourceID": None,
            "Description": "This survey is designed to help us understand how the programme has helped you. We may use this information to report back to our funders, in which case it will be anonymized.",
            "Created": "2022-06-16 09:35:20",
            "Updated": "2022-06-16 10:23:42",
            "CreatedBy": "joyce.castaneda",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"56\"": {
            "QuestionnaireID": "56",
            "Title": "WS: Bridge to Self Sufficiency Assessment Tool",
            "SourceID": None,
            "Description": "This questionnaire is intended to be used 3 times a year (before start of intervention, in the middle of the year and at the end of the year) to assess participant's progression in five categories: (1) family stability, (2) well-being, (3) financial management, (4) education and training, and (5) employment and career management",
            "Created": "2017-03-09 16:40:41",
            "Updated": "2021-03-12 20:01:10",
            "CreatedBy": "maria.van.zeller",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"180\"": {
            "QuestionnaireID": "180",
            "Title": "WS: Case study",
            "SourceID": None,
            "Description": "",
            "Created": "2022-05-19 17:40:15",
            "Updated": "2022-05-19 17:40:27",
            "CreatedBy": "joyce.castaneda",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"159\"": {
            "QuestionnaireID": "159",
            "Title": "WS: Coaching &ldquo; Outcomes &ldquo; Clients Assessment (Annual)",
            "SourceID": None,
            "Description": "This is answered by the client at the beginning of the academic year (or at the point of onboarding a new coachee) and at the end of the academic year (July)",
            "Created": "2021-10-19 11:51:26",
            "Updated": "2022-02-08 14:40:00",
            "CreatedBy": "joyce.castaneda",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"160\"": {
            "QuestionnaireID": "160",
            "Title": "WS: Coaching &ldquo; Outcomes &ldquo; Coachs Observations (Termly)",
            "SourceID": None,
            "Description": "This is answered by the coach at the beginning of the academic year (or at the point of onboarding a new coachee), then at the end of each term (December, March, July)",
            "Created": "2021-10-19 14:54:55",
            "Updated": "2022-02-08 14:39:30",
            "CreatedBy": "joyce.castaneda",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"165\"": {
            "QuestionnaireID": "165",
            "Title": "WS: Diagnostics Listening, Reading & Writing Test (Entry 1)",
            "SourceID": None,
            "Description": "",
            "Created": "2022-01-26 16:11:03",
            "Updated": "2022-02-17 16:55:07",
            "CreatedBy": "joyce.castaneda",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"167\"": {
            "QuestionnaireID": "167",
            "Title": "WS: Diagnostics Listening, Reading & Writing Test (Entry 2)",
            "SourceID": None,
            "Description": "",
            "Created": "2022-01-31 10:39:45",
            "Updated": "2022-02-11 11:03:59",
            "CreatedBy": "joyce.castaneda",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"168\"": {
            "QuestionnaireID": "168",
            "Title": "WS: Diagnostics Listening, Reading & Writing Test (Entry 3)",
            "SourceID": None,
            "Description": "",
            "Created": "2022-01-31 10:50:00",
            "Updated": "2022-02-17 17:04:11",
            "CreatedBy": "joyce.castaneda",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"55\"": {
            "QuestionnaireID": "55",
            "Title": "WS: ESOL final questionnaire",
            "SourceID": None,
            "Description": "A questionnaire to be filled in by students at the end of their course.",
            "Created": "2017-01-08 14:10:20",
            "Updated": "2021-03-12 20:03:43",
            "CreatedBy": "margaret.brown",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"50\"": {
            "QuestionnaireID": "50",
            "Title": "WS: ESOL Progress Questionnaire",
            "SourceID": None,
            "Description": "A questionnaire to monitor the progress of students attending ESOL classes  at Baytree.",
            "Created": "2016-11-22 14:02:46",
            "Updated": "2022-01-13 10:48:31",
            "CreatedBy": "margaret.brown",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"175\"": {
            "QuestionnaireID": "175",
            "Title": "WS: Feedback and ideas",
            "SourceID": None,
            "Description": "Feedback and ideas by users gathered from the suggestion box, in activities or sessions or other means.",
            "Created": "2022-05-09 10:16:31",
            "Updated": "2022-05-09 10:16:44",
            "CreatedBy": "joyce.castaneda",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"163\"": {
            "QuestionnaireID": "163",
            "Title": "WS: Individual Learning Plan and End of Course Review",
            "SourceID": None,
            "Description": "",
            "Created": "2021-12-16 16:17:47",
            "Updated": "2022-01-04 10:17:06",
            "CreatedBy": "joyce.castaneda",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"164\"": {
            "QuestionnaireID": "164",
            "Title": "WS: Information, Advice and Guidance",
            "SourceID": None,
            "Description": "",
            "Created": "2022-01-12 11:22:13",
            "Updated": "2022-04-29 11:50:42",
            "CreatedBy": "joyce.castaneda",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"170\"": {
            "QuestionnaireID": "170",
            "Title": "WS: Referral/signposting log",
            "SourceID": None,
            "Description": "",
            "Created": "2022-02-10 09:52:20",
            "Updated": "2022-02-10 10:13:13",
            "CreatedBy": "joyce.castaneda",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"177\"": {
            "QuestionnaireID": "177",
            "Title": "WS: Student handbook evidence",
            "SourceID": None,
            "Description": "Form is used to evidence that ESOL students handbook were received and read by the learners.",
            "Created": "2022-05-10 16:30:40",
            "Updated": "2022-05-10 16:32:39",
            "CreatedBy": "joyce.castaneda",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"74\"": {
            "QuestionnaireID": "74",
            "Title": "WS: Testimonials",
            "SourceID": None,
            "Description": "Written or verbal testimonials from the Women's service users",
            "Created": "2018-01-07 16:24:13",
            "Updated": "2021-03-12 19:56:33",
            "CreatedBy": "margaret.brown",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"173\"": {
            "QuestionnaireID": "173",
            "Title": "WS: Wellbeing Workshop questionnaire",
            "SourceID": None,
            "Description": "",
            "Created": "2022-05-04 17:38:54",
            "Updated": "2022-05-04 17:38:54",
            "CreatedBy": "joyce.castaneda",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"101\"": {
            "QuestionnaireID": "101",
            "Title": "WS: Women entered education or found paid / volunteer work",
            "SourceID": None,
            "Description": "Questionnaire to list down women who entered education or found a job or volunteer work",
            "Created": "2019-02-13 17:00:32",
            "Updated": "2021-10-19 10:34:14",
            "CreatedBy": "joyce.castaneda",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"92\"": {
            "QuestionnaireID": "92",
            "Title": "WS: Workshop / Activity Feedback",
            "SourceID": None,
            "Description": "",
            "Created": "2018-09-19 15:42:46",
            "Updated": "2022-02-08 14:41:18",
            "CreatedBy": "joyce.castaneda",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"178\"": {
            "QuestionnaireID": "178",
            "Title": "YS: Case study",
            "SourceID": None,
            "Description": "",
            "Created": "2022-05-13 15:45:24",
            "Updated": "2022-05-19 15:43:19",
            "CreatedBy": "joyce.castaneda",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"94\"": {
            "QuestionnaireID": "94",
            "Title": "YS: Club Leader Evaluation Questionnaire",
            "SourceID": None,
            "Description": "",
            "Created": "2018-09-19 17:46:34",
            "Updated": "2021-03-12 19:40:56",
            "CreatedBy": "joyce.castaneda",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"174\"": {
            "QuestionnaireID": "174",
            "Title": "YS: Feedback and ideas",
            "SourceID": None,
            "Description": "Feedback and ideas by users gathered from the suggestion box, in activities or sessions or other means.",
            "Created": "2022-05-09 09:34:13",
            "Updated": "2022-05-09 09:36:45",
            "CreatedBy": "joyce.castaneda",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"125\"": {
            "QuestionnaireID": "125",
            "Title": "YS: Literacy Youth Club U11 (Final)",
            "SourceID": None,
            "Description": "This is for this Literacy KS2. To be answered by both the club volunteer and service user. For scales:Baytree termly goals: 1 (Strongly disagree) - 10 (Strongly Agree) How much I enjoy Maths: 1 (I don't like it!) - 10 ( I love it!) How confident are you at Maths: 1 (Not very confident) - 10 (I'm the best!)I did it questions: 1 (Strongly agree) - 10 (Strongly disagree)",
            "Created": "2019-11-14 16:33:39",
            "Updated": "2021-03-12 19:32:25",
            "CreatedBy": "joyce.castaneda",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"126\"": {
            "QuestionnaireID": "126",
            "Title": "YS: Maths Youth Club O11 (Final)",
            "SourceID": None,
            "Description": "This is for Maths KS3. To be answered by both the club volunteer and the service user. For scales:Baytree termly goals: 1 (Strongly disagree) - 10 (Strongly Agree) How much I enjoy Maths: 1 (I don't like it!) - 10 ( I love it!) How confident are you at Maths: 1 (Not very confident) - 10 (I'm the best!)I did it questions: 1 (Strongly agree) - 10 (Strongly disagree)",
            "Created": "2019-11-14 17:19:13",
            "Updated": "2021-03-12 19:32:14",
            "CreatedBy": "joyce.castaneda",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"127\"": {
            "QuestionnaireID": "127",
            "Title": "YS: Maths Youth Club U11 (Final)",
            "SourceID": None,
            "Description": "This is for Maths KS2: Yr 3 &4, Maths KS2: Yr 5 & 6. To be answered by both the club volunteer and the service user. For scales:Baytree termly goals: 1 (Strongly disagree) - 10 (Strongly Agree) How much I enjoy Maths: 1 (I don't like it!) - 10 ( I love it!) How confident are you at Maths: 1 (Not very confident) - 10 (I'm the best!)I did it questions: 1 (Strongly agree) - 10 (Strongly disagree)",
            "Created": "2019-11-14 17:25:58",
            "Updated": "2021-03-12 19:31:49",
            "CreatedBy": "joyce.castaneda",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"138\"": {
            "QuestionnaireID": "138",
            "Title": "YS: Mentee Mentoring Progress Form",
            "SourceID": None,
            "Description": "This form is used with mentee twice during the academic year. The scale used is 1 to 5 , 1 as Strong Disagree and 5 as Strongly Agree.",
            "Created": "2020-11-03 12:55:12",
            "Updated": "2021-06-01 17:01:42",
            "CreatedBy": "joyce.castaneda",
            "UpdatedBy": "angela.parkes"
        },
        "questionnaire id=\"102\"": {
            "QuestionnaireID": "102",
            "Title": "YS: Participant Questionnaire",
            "SourceID": "390",
            "Description": "This survey is designed to help us understand how the activities we run at xxxx support the individuals who use them. We may use this information to report back to our funders, in which case it will be anonymized. We will ask you to complete the following survey twice/three times; when you first join us, at the end of 12 weeks and then once you have been with us for 6 months.",
            "Created": "2019-03-27 10:30:40",
            "Updated": "2021-03-12 19:48:57",
            "CreatedBy": "matthew.croston.transit",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"158\"": {
            "QuestionnaireID": "158",
            "Title": "YS: Participant Questionnaire: Young Volunteering",
            "SourceID": None,
            "Description": "",
            "Created": "2021-07-23 14:44:14",
            "Updated": "2021-07-23 14:44:14",
            "CreatedBy": "baytree.intern2",
            "UpdatedBy": "baytree.intern2"
        },
        "questionnaire id=\"95\"": {
            "QuestionnaireID": "95",
            "Title": "YS: Poster feedback Questionnaire",
            "SourceID": None,
            "Description": "",
            "Created": "2018-09-20 16:45:24",
            "Updated": "2021-03-12 19:40:25",
            "CreatedBy": "joyce.castaneda",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"152\"": {
            "QuestionnaireID": "152",
            "Title": "YS: Referral",
            "SourceID": None,
            "Description": "",
            "Created": "2021-02-09 16:54:28",
            "Updated": "2021-10-29 10:17:41",
            "CreatedBy": "joyce.castaneda",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"122\"": {
            "QuestionnaireID": "122",
            "Title": "YS: Testimonials",
            "SourceID": None,
            "Description": "Written or verbal testimonials from the Youth service users",
            "Created": "2019-11-08 21:06:38",
            "Updated": "2021-03-12 19:33:44",
            "CreatedBy": "joyce.castaneda",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"150\"": {
            "QuestionnaireID": "150",
            "Title": "YS: Wellbeing",
            "SourceID": None,
            "Description": "",
            "Created": "2021-01-11 04:51:20",
            "Updated": "2021-10-29 10:19:16",
            "CreatedBy": "joyce.castaneda",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"69\"": {
            "QuestionnaireID": "69",
            "Title": "YS: Young Volunteers Questionnaire",
            "SourceID": None,
            "Description": "",
            "Created": "2017-09-29 20:04:10",
            "Updated": "2021-03-12 19:58:22",
            "CreatedBy": "joyce.castaneda",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"124\"": {
            "QuestionnaireID": "124",
            "Title": "YS: Youth 13+ Needs Assessment",
            "SourceID": None,
            "Description": "",
            "Created": "2019-11-12 11:27:24",
            "Updated": "2022-04-01 10:52:43",
            "CreatedBy": "joyce.castaneda",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"128\"": {
            "QuestionnaireID": "128",
            "Title": "YS: Youth Club Questionnaire O11",
            "SourceID": None,
            "Description": "This is for girls under 11. To be answered by both the club volunteer and the service user. For scales:Baytree termly goals: 1 (Strongly disagree) - 10 (Strongly Agree) How much I enjoy the subject: 1 (I don't like it!) - 10 ( I love it!) How confident are you at the subject: 1 (Not very confident) - 10 (I'm the best!)I did it questions: 1 (Strongly agree) - 10 (Strongly disagree)",
            "Created": "2020-01-06 10:16:02",
            "Updated": "2021-03-12 19:31:25",
            "CreatedBy": "joyce.castaneda",
            "UpdatedBy": "joyce.castaneda"
        },
        "questionnaire id=\"129\"": {
            "QuestionnaireID": "129",
            "Title": "YS: Youth Club Questionnaire U11",
            "SourceID": None,
            "Description": "This is for girls over 11. To be answered by both the club volunteer and the service user. For scales:Baytree termly goals: 1 (Strongly disagree) - 10 (Strongly Agree) How much I enjoy the subject: 1 (I don't like it!) - 10 ( I love it!) How confident are you at the subject: 1 (Not very confident) - 10 (I'm the best!)I did it questions: 1 (Strongly agree) - 10 (Strongly disagree)",
            "Created": "2020-01-10 10:31:48",
            "Updated": "2021-03-12 19:30:55",
            "CreatedBy": "joyce.castaneda",
            "UpdatedBy": "joyce.castaneda"
        }
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
