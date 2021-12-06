import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'global_variables.dart' as global;
import 'package:http/http.dart' as http;

class RecordsPage extends StatefulWidget {
  @override
  _RecordsPageState createState() => _RecordsPageState();
}

Future<String?> getTokenPreference() async {
  SharedPreferences prefs = await SharedPreferences.getInstance();
  String? token = prefs.getString("token");
  return token;
}

// Get sessions data with GET request
Future<List<dynamic>?> getSessions() async {
  List<dynamic> list = [];

  var url = Uri.parse(global.host + '/sessions/');
  http.Response response = await http.get(url);
  //print(response.statusCode);
  try {
    if (response.statusCode == 200) {
      String data = response.body;
      //debugPrint(data);
      List<dynamic> list = json.decode(data);

      return list;
      // return decodedData;
    }
  } catch (e) {
    return list;
  }
}

// Model for sessions data
class SessionsData {
  int id;
  String createdAt;
  int mentor;
  int mentee;
  bool attendenceMentor;
  bool attendenceMentee;
  DateTime clockIn;
  DateTime clockOut;
  String notes;

  SessionsData({
    required this.id,
    required this.createdAt,
    required this.mentor,
    required this.mentee,
    required this.attendenceMentor,
    required this.attendenceMentee,
    required this.clockIn,
    required this.clockOut,
    required this.notes,
  });

  factory SessionsData.fromJson(Map<String, dynamic> json) => SessionsData(
        id: json["id"],
        createdAt: json["created_at"],
        mentor: json["mentor"],
        mentee: json["mentee"],
        attendenceMentor: json["attended_by_mentor"],
        attendenceMentee: json["attended_by_mentee"],
        clockIn: DateTime.parse(json["clock_in"]),
        clockOut: DateTime.parse(json["clock_out"]),
        notes: json["notes"],
      );
}

// Get questionnaires data with GET request
Future<List<dynamic>?> getQuestionnaires() async {
  List<dynamic> list = [];

  var url = Uri.parse(global.host + '/questionnaires/');
  http.Response response = await http.get(url);
  //print(response.statusCode);
  try {
    if (response.statusCode == 200) {
      String data = response.body;
      //debugPrint(data);
      List<dynamic> list = json.decode(data);

      return list;
      // return decodedData;
    }
  } catch (e) {
    return list;
  }
}



// Model for questionnaire  data
class QuestionnaireData {
  int id;
  String createdAt;
  String updatedAt;
  int mentor;
  int mentee;
  List<QuestionAnswers> questionAnswers;

  QuestionnaireData({
    required this.id,
    required this.createdAt,
    required this.updatedAt,
    required this.mentor,
    required this.mentee,
    required this.questionAnswers,
  });

  factory QuestionnaireData.fromJson(Map<String, dynamic> json) => QuestionnaireData(
    id: json["id"],
    createdAt: json["created_at"],
    updatedAt: json["updated_at"],
    mentor: json["mentor"],
    mentee: json["mentee"],
    questionAnswers: List<QuestionAnswers>.from(json["questions_and_answers"].map((x) => QuestionAnswers.fromJson(x))),
  );

  Map<String, dynamic> toJson() => {
    "id": id,
    "created_at": createdAt,
    "updated_at": updatedAt,
    "mentor": mentor,
    "mentee": mentee,
    "questions_and_answers": List<dynamic>.from(questionAnswers.map((x) => x.toJson())),

  };
}


class QuestionAnswers {
  int id;
  int questionnaire;
  String question;
  String answer;

  QuestionAnswers({
    required this.id,
    required this.questionnaire,
    required this.question,
    required this.answer,
  });

  factory QuestionAnswers.fromJson(Map<String, dynamic> json) => QuestionAnswers(
    id: json["id"],
    questionnaire: json["questionnaire"],
    question: json["question"],
    answer: json["answer"],
  );

  Map<String, dynamic> toJson() => {
    "id": id,
    "questionnaire": questionnaire,
    "question": question,
    "answer": answer,
  };
}



class _RecordsPageState extends State<RecordsPage> {
  // Dynamic list
  List<dynamic> sessionsData = [];

  var dropdownValue;

  // Lists

  //TODO : Implement GET request to receive monthly progress data
  int numberOfReports = 2;
  List<String> monthlyReportsList = ["November 2021", "October 2021"];
  List<List<String>> questionsList = [
    ["Question 1: What is ?", "Question 2 How is ?", "Question 3 How is ?"],
    ["Question 1: ...", "Question 2 .. "]
  ];
  List<int> questionSizeList = [3, 2];
  List<List<String>> answersList = [
    ["3", "4", "5"],
    ["1", "4"]
  ];

  //List<String> sessionDateList = ["November 1, 2021", "November 4, 2021", "November 5, 2021", "September 12, 2021"];
  //List<String> startTimeList = ["12:00 PM", "1:00 PM", "2:00 PM", "2:00 PM"];
  //List<String> endTimeList = ["1:00 PM", "2:00 PM", "3:00 PM", "3:00 PM"];
  //List<String> notesList = ["Note 1", "Note 2", "Note 3", "Note ...."];

  List<String> sessionDateList = [];
  List<String> startTimeList = [];
  List<String> endTimeList = [];
  List<String> notesList = [];

  List<List<String>> monthlySessionsList = [];
  List<List<String>> monthlyNotesList = [];

  // Variables:
  String? _token = "";
  SharedPreferences? sharedPreferences;

  // get user token
  void updateToken(String? token) {
    setState(() {
      _token = token;
    });
  }

  void updateSessionsData(List<dynamic>? data) {
    setState(() {
      sessionDateList = [];
      startTimeList = [];
      endTimeList = [];
      notesList = [];
      int index = global.menteeList.indexOf(dropdownValue);
      for (int i = 0; i < data!.length; i++) {
        SessionsData fact = SessionsData.fromJson(data[i]);

        if (fact.mentor == global.mentorID && fact.mentee == global.menteeIdList[index]) {
          sessionDateList.add(DateFormat('MMMM dd, yyyy').format(fact.clockIn).toString());
          startTimeList.add(DateFormat('h:mm a').format(fact.clockIn).toString());
          endTimeList.add(DateFormat('h:mm a').format(fact.clockOut).toString());
          notesList.add(fact.notes);
        }
      }
      updateSessionsInReports(); // update sessions in progress reports
    });
  }

  void updateSessionsInReports() {
    DateFormat format = new DateFormat("MMMM dd, yyyy");
    DateFormat dateFormat = new DateFormat("MMMM yyyy");

    monthlySessionsList = [];
    monthlyNotesList = [];

    List<String> temp1 = [];
    List<String> temp2 = [];
    for (int i = 0; i < monthlyReportsList.length; i++) {
      // Monthly reports
      DateTime formattedDate2 = dateFormat.parse(monthlyReportsList[i]);

      for (int j = 0; j < sessionDateList.length; j++) {
        // Sessions
        DateTime formattedDate = format.parse(sessionDateList[j]);

        if (formattedDate.month == formattedDate2.month && formattedDate.year == formattedDate2.year) {
          //print(sessionDateList[j]);
          temp1.add(sessionDateList[j]);
          temp2.add(notesList[j]);
        }
      }
      monthlySessionsList.add(temp1);
      monthlyNotesList.add(temp2);

      temp1 = [];
      temp2 = [];
    }
  }

  @override
  void initState() {
    getTokenPreference().then(updateToken);
    getSessions().then(updateSessionsData);
    getQuestionnaires();

    super.initState();

    updateSessionsInReports();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: TopBar(),
      body: Container(
        decoration: const BoxDecoration(
          color: Color(0xedffffff),
        ),
        child: Column(
          children: [
            DropDownMenteeList(),
            Expanded(
              child: ListView(
                padding: EdgeInsets.only(top: 5, left: 10, right: 10),
                children: <Widget>[
                  monthlyReports(),
                  monthlyProgressPopup(),
                ],
              ),
            ),
            Expanded(
              child: ListView(
                padding: EdgeInsets.only(top: 5, left: 10, right: 10),
                children: <Widget>[
                  menteeSessions(),
                  sessionsPopup(),
                  // Text('Key:'),
                  // Text(_token ?? " "),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Top header
  AppBar TopBar() {
    return AppBar(
      title: const Text('Records'),
      centerTitle: true,
      backgroundColor: const Color(0xff5ab031),
      automaticallyImplyLeading: false,
      actions: [
        IconButton(
          icon: Icon(Icons.edit_sharp),
          onPressed: ()  {
            showErrorDialog(context);
            }
        ),
      ],
    );
  }

  // Dialog for editing record
  showErrorDialog(BuildContext context) {
    // set up the buttons
    Widget cancelButton = TextButton(
      child: Text("Dismiss"),
      onPressed: () => Navigator.pop(context),
    );

    // set up the AlertDialog
    AlertDialog alert = AlertDialog(
      //title: Text("Error!"),
      content: Text("Contact the admin to make changes to any records."),
      actions: [
        cancelButton,
      ],
    );

    // show the dialog
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return alert;
      },
    );
  }

  // Popup to view monthly progress reports
  Container monthlyProgressPopup() {
    return Container(
      margin: EdgeInsets.only(top: 20),
      // child: ButtonTheme(
      child: Column(
        children: [
          for (var i = 0; i < monthlyReportsList.length; i++)
            // ignore: unnecessary_new
            new Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                Expanded(
                  flex: 1,
                  child: Container(
                    child: RaisedButton(
                      //padding: EdgeInsets.only(top: 12, left: 5, right: 5, bottom: 12),
                      onPressed: () {
                        showDialog(
                            context: context,
                            builder: (BuildContext context) {
                              var height = MediaQuery.of(context).size.height;
                              var width = MediaQuery.of(context).size.width;
                              return AlertDialog(
                                contentPadding: EdgeInsets.only(top: 14, left: 8, right: 8, bottom: 14),
                                content: Stack(
                                  overflow: Overflow.visible,
                                  children: <Widget>[
                                    Positioned(
                                      right: -25.0,
                                      top: -25.0,
                                      child: InkResponse(
                                        onTap: () {
                                          Navigator.of(context).pop();
                                        },
                                        child: CircleAvatar(
                                          child: Icon(Icons.close),
                                          backgroundColor: Colors.red,
                                        ),
                                      ),
                                    ),
                                    Form(
                                      child: Container(
                                        width: width - 25,
                                        height: height - 250,
                                        child: SingleChildScrollView(
                                          child: Column(
                                            mainAxisSize: MainAxisSize.min,
                                            crossAxisAlignment: CrossAxisAlignment.start,
                                            children: <Widget>[
                                              Padding(
                                                padding: EdgeInsets.only(top: 8, left: 0, right: 0, bottom: 2),
                                                child: Text(
                                                  dropdownValue,
                                                  textAlign: TextAlign.left,
                                                  style: new TextStyle(
                                                    fontSize: 18.0,
                                                  ),
                                                ),
                                              ),
                                              Padding(
                                                padding: EdgeInsets.only(top: 8, left: 0, right: 0, bottom: 20),
                                                child: Text(
                                                  monthlyReportsList[i],
                                                  textAlign: TextAlign.left,
                                                  style: new TextStyle(
                                                    fontSize: 19.0,
                                                  ),
                                                ),
                                              ),
                                              Column(
                                                mainAxisSize: MainAxisSize.min,
                                                crossAxisAlignment: CrossAxisAlignment.start,
                                                children: [
                                                  for (int j = 0; j < questionSizeList[i]; j++)
                                                    Container(
                                                      //margin: const EdgeInsets.all(15.0),
                                                      padding: const EdgeInsets.all(3.0),
                                                      decoration: BoxDecoration(
                                                          border: j == 0
                                                              ? Border.all(color: Colors.grey)
                                                              : Border(
                                                                  bottom: BorderSide(color: Colors.grey),
                                                                  left: BorderSide(color: Colors.grey),
                                                                  right: BorderSide(color: Colors.grey),
                                                                )),
                                                      child: Padding(
                                                        padding: EdgeInsets.only(top: 8, left: 0, right: 0, bottom: 2),
                                                        child: new Row(
                                                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                                          children: <Widget>[
                                                            new Flexible(
                                                              child: Padding(
                                                                padding: const EdgeInsets.all(0.0),
                                                                child: new Text(
                                                                  questionsList[i][j],
                                                                  style: new TextStyle(
                                                                    fontSize: 14.0,
                                                                  ),
                                                                  textAlign: TextAlign.left,
                                                                ),
                                                              ),
                                                            ),
                                                            new Flexible(
                                                              child: Padding(
                                                                padding: const EdgeInsets.all(0.0),
                                                                child: new Text(
                                                                  answersList[i][j],
                                                                  textAlign: TextAlign.left,
                                                                  style: new TextStyle(
                                                                    fontSize: 14.0,
                                                                  ),
                                                                ),
                                                              ),
                                                            ),
                                                          ],
                                                        ),
                                                      ),
                                                    ),
                                                  Padding(
                                                    padding: EdgeInsets.only(top: 60, left: 0, right: 0, bottom: 20),
                                                    child: Text(
                                                      "Session Notes: ",
                                                      textAlign: TextAlign.left,
                                                      style: new TextStyle(
                                                        fontSize: 18.0,
                                                      ),
                                                    ),
                                                  ),
                                                  Column(
                                                    mainAxisSize: MainAxisSize.min,
                                                    crossAxisAlignment: CrossAxisAlignment.start,
                                                    children: [
                                                      for (int k = 0; k < monthlySessionsList[i].length; k++)
                                                        Container(
                                                          //margin: const EdgeInsets.all(15.0),
                                                          padding: const EdgeInsets.all(3.0),
                                                          decoration: BoxDecoration(
                                                              border: k == 0
                                                                  ? Border.all(color: Colors.grey)
                                                                  : Border(
                                                                      bottom: BorderSide(color: Colors.grey),
                                                                      left: BorderSide(color: Colors.grey),
                                                                      right: BorderSide(color: Colors.grey),
                                                                    )),
                                                          child: Padding(
                                                            padding: EdgeInsets.only(top: 6, left: 0, right: 0, bottom: 2),
                                                            child: new Row(
                                                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                                              children: <Widget>[
                                                                Column(
                                                                  mainAxisAlignment: MainAxisAlignment.start,
                                                                  crossAxisAlignment: CrossAxisAlignment.start,
                                                                  children: <Widget>[
                                                                    Text(
                                                                      monthlySessionsList[i][k],
                                                                      textAlign: TextAlign.left,
                                                                      style: new TextStyle(
                                                                        fontSize: 15.0,
                                                                      ),
                                                                    ),
                                                                    Padding(
                                                                      padding: EdgeInsets.only(top: 20, left: 0, right: 0, bottom: 2),
                                                                      child: Text(
                                                                        monthlyNotesList[i][k],
                                                                        textAlign: TextAlign.left,
                                                                        style: new TextStyle(
                                                                          fontSize: 14.0,
                                                                        ),
                                                                      ),
                                                                    ),
                                                                  ],
                                                                ),
                                                              ],
                                                            ),
                                                          ),
                                                        ),
                                                    ],
                                                  ),
                                                ],
                                              ),
                                            ],
                                          ),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              );
                            });
                      },
                      child: Align(
                        alignment: Alignment.centerLeft,
                        child: Text(
                          monthlyReportsList[i],
                          style: new TextStyle(fontSize: 18.0),
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
        ],
      ),

      //   ),
    );
  }

  // Popup to view sessions
  Container sessionsPopup() {
    return Container(
      margin: EdgeInsets.only(top: 20),
      // child: ButtonTheme(

      child: Column(
        children: [
          for (var i = 0; i < sessionDateList.length; i++)

            // ignore: unnecessary_new
            new Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                Expanded(
                  flex: 1,
                  child: Container(
                    child: RaisedButton(
                      //padding: EdgeInsets.only(top: 12, left: 5, right: 5, bottom: 12),
                      onPressed: () {
                        showDialog(
                            context: context,
                            builder: (BuildContext context) {
                              var height = MediaQuery.of(context).size.height;
                              var width = MediaQuery.of(context).size.width;
                              return AlertDialog(
                                contentPadding: EdgeInsets.only(top: 14, left: 8, right: 8, bottom: 14),
                                content: Stack(
                                  overflow: Overflow.visible,
                                  children: <Widget>[
                                    Positioned(
                                      right: -25.0,
                                      top: -25.0,
                                      child: InkResponse(
                                        onTap: () {
                                          Navigator.of(context).pop();
                                        },
                                        child: CircleAvatar(
                                          child: Icon(Icons.close),
                                          backgroundColor: Colors.red,
                                        ),
                                      ),
                                    ),
                                    Form(
                                      child: Container(
                                        width: width - 25,
                                        height: height - 450,
                                        child: SingleChildScrollView(
                                          child: Column(
                                            mainAxisSize: MainAxisSize.min,
                                            crossAxisAlignment: CrossAxisAlignment.start,
                                            children: <Widget>[
                                              Padding(
                                                padding: EdgeInsets.only(top: 8, left: 0, right: 0, bottom: 2),
                                                child: Text(
                                                  dropdownValue,
                                                  textAlign: TextAlign.left,
                                                  style: new TextStyle(
                                                    fontSize: 18.0,
                                                  ),
                                                ),
                                              ),
                                              Padding(
                                                padding: EdgeInsets.only(top: 20, left: 0, right: 0, bottom: 12),
                                                child: Text(
                                                  sessionDateList[i],
                                                  textAlign: TextAlign.left,
                                                  style: new TextStyle(
                                                    fontSize: 16.0,
                                                  ),
                                                ),
                                              ),
                                              Container(
                                                //margin: const EdgeInsets.all(15.0),
                                                child: Padding(
                                                  padding: EdgeInsets.only(top: 8, left: 0, right: 0, bottom: 2),
                                                  child: new Row(
                                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                                    children: <Widget>[
                                                      new Flexible(
                                                        child: Padding(
                                                          padding: const EdgeInsets.all(0.0),
                                                          child: new Text(
                                                            "Start Time:",
                                                            style: new TextStyle(
                                                              fontSize: 14.0,
                                                            ),
                                                            textAlign: TextAlign.left,
                                                          ),
                                                        ),
                                                      ),
                                                      new Flexible(
                                                        child: Padding(
                                                          padding: const EdgeInsets.all(0.0),
                                                          child: new Text(
                                                            startTimeList[i],
                                                            textAlign: TextAlign.left,
                                                            style: new TextStyle(
                                                              fontSize: 14.0,
                                                            ),
                                                          ),
                                                        ),
                                                      ),
                                                    ],
                                                  ),
                                                ),
                                              ),
                                              Container(
                                                //margin: const EdgeInsets.all(15.0),

                                                child: Padding(
                                                  padding: EdgeInsets.only(top: 8, left: 0, right: 0, bottom: 2),
                                                  child: new Row(
                                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                                    children: <Widget>[
                                                      new Flexible(
                                                        child: Padding(
                                                          padding: const EdgeInsets.all(0.0),
                                                          child: new Text(
                                                            "End Time: ",
                                                            textAlign: TextAlign.left,
                                                            style: new TextStyle(
                                                              fontSize: 14.0,
                                                            ),
                                                          ),
                                                        ),
                                                      ),
                                                      new Flexible(
                                                        child: Padding(
                                                          padding: const EdgeInsets.all(0.0),
                                                          child: new Text(
                                                            endTimeList[i],
                                                            textAlign: TextAlign.left,
                                                            style: new TextStyle(
                                                              fontSize: 14.0,
                                                            ),
                                                          ),
                                                        ),
                                                      ),
                                                    ],
                                                  ),
                                                ),
                                              ),
                                              Padding(
                                                padding: EdgeInsets.only(top: 20, left: 0, right: 0, bottom: 0),
                                                child: Text(
                                                  "Session Notes: ",
                                                  textAlign: TextAlign.left,
                                                  style: new TextStyle(
                                                    fontSize: 16.0,
                                                  ),
                                                ),
                                              ),
                                              Padding(
                                                padding: EdgeInsets.only(top: 8, left: 0, right: 0, bottom: 0),
                                                child: Text(
                                                  notesList[i],
                                                  textAlign: TextAlign.left,
                                                  style: new TextStyle(
                                                    fontSize: 14.0,
                                                  ),
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              );
                            });
                      },
                      child: Align(
                        alignment: Alignment.centerLeft,
                        child: Text(
                          sessionDateList[i],
                          style: new TextStyle(fontSize: 18.0),
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
        ],
      ),
    );
  }

  // Header
  Container monthlyReports() {
    return Container(
      child: Text(
        'Questionnaires:',
        style: new TextStyle(
          fontSize: 18.0,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  // Header
  Container menteeSessions() {
    return Container(
      child: Text(
        'Mentee Sessions:',
        style: new TextStyle(
          fontSize: 18.0,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  // Drop down menu to select mentees
  Container DropDownMenteeList() {
    //List<String> mentees = ["Select a mentee", "User Name 1", _token ?? " "];
    List<String> mentees = global.menteeList; // global variable
    return Container(
      padding: EdgeInsets.only(top: 5, left: 10, right: 10),
      margin: const EdgeInsets.only(bottom: 20.0),
      child: Row(
        children: <Widget>[
          Expanded(
            flex: 0,
            child: Text(
              'Mentee:   ',
              style: new TextStyle(
                fontSize: 20.0,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          Expanded(
            flex: 1,
            child: Container(
                height: 50,
                child: DropdownButton<String>(
                  isExpanded: true,
                  hint: Text("Select a mentee"),
                  value: dropdownValue,
                  icon: const Icon(Icons.arrow_drop_down),
                  iconSize: 25,
                  elevation: 16,
                  style: const TextStyle(color: Colors.black, fontSize: 18.0),
                  underline: Container(
                    height: 2,
                    color: Colors.green,
                  ),
                  onChanged: (String? newValue) {
                    setState(() {
                      dropdownValue = newValue!;
                      getSessions().then(updateSessionsData); // update sessions
                    });
                  },
                  items: mentees.map<DropdownMenuItem<String>>((String value) {
                    return DropdownMenuItem<String>(
                      value: value,
                      child: Text(value),
                    );
                  }).toList(),
                )),
          ),
        ],
      ),
    );
  }
}
