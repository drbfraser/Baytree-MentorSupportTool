import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;
import 'package:baytree_mobile/login_page.dart';
import 'package:baytree_mobile/messages_page.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'main.dart';
import 'global_variables.dart' as global;
import 'package:intl/intl.dart';
import 'package:date_picker_timeline/date_picker_timeline.dart';
import 'package:syncfusion_flutter_charts/charts.dart';

import 'navigation_bar.dart';

class HomePage extends StatefulWidget {
  @override
  _HomePageState createState() => _HomePageState();
}

Future<String?> getTokenPreference() async {
  SharedPreferences prefs = await SharedPreferences.getInstance();
  String? token = prefs.getString("token");
  return token;
}

Future<int?> getIDPreference() async {
  SharedPreferences prefs = await SharedPreferences.getInstance();
  int? id = prefs.getInt("id");
  return id;
}

Future<List<List<String>>?> getMenteeList() async {
  List<String> mentees = [];
  List<String> id = [];
  String urlMentorID = "http://192.168.4.249:8000" + "/users/mentors/" + global.mentorID.toString();

  var url = Uri.parse(urlMentorID);
  http.Response response = await http.get(url);
  try {
    if (response.statusCode == 200) {
      String data = response.body;
      var decodedJson = json.decode(data);
      global.Record recordFromJson(String str) => global.Record.fromJson(json.decode(data));
      String jsonString = decodedJson.toString();

      global.Record record = recordFromJson(jsonString);
      int num = record.data.menteeUser.length;
      for (int i = 0; i < num; i++) {
        mentees.add(record.data.menteeUser[i].user.firstName + " " + record.data.menteeUser[i].user.lastName);
        id.add(record.data.menteeUser[i].user.id.toString());
      }

      return [mentees, id];
      // return decodedData;
    }
  } catch (e) {
    return [mentees, id];
  }
}

// Get goals data with GET request
Future<List<dynamic>?> getSessions() async {
  List<dynamic> list = [];

  var url = Uri.parse('http://192.168.4.249:8000/goals/goal');
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

// Model for goals data
class GoalsData {
  //int id;
  int mentor;
  int mentee;
  String title;
  DateTime date;
  DateTime goalReviewDate;
  String content;
  String status;

  GoalsData({
    //required this.id,
    required this.mentor,
    required this.mentee,
    required this.title,
    required this.date,
    required this.goalReviewDate,
    required this.content,
    required this.status,
  });

  factory GoalsData.fromJson(Map<String, dynamic> json) => GoalsData(
        //id: json["id"],
        mentor: json["mentor"],
        mentee: json["mentee"],
        title: json["title"],
        date: DateTime.parse(json["date"]),
        goalReviewDate: DateTime.parse(json["goal_review_date"]),
        content: json["content"],
        status: json["status"],
      );
}

// Reference: https://help.syncfusion.com/flutter/circular-charts/getting-started
// Model for pie chart data
class ChartData {
  ChartData(this.x, this.y, this.text, [this.color]);
  final String x;
  final double y;
  final Color? color;
  final String text;
}

class _HomePageState extends State<HomePage> {
  SharedPreferences? sharedPreferences;

  // Initialize variables
  String? _token = "";
  int? _id = 0;

  List<String> menteeList = [" "];
  List<int> menteeIdList = [];

  List<String> goalNameList = [];
  List<String> goalDescriptionList = [];
  List<String> goalDateList = [];

  List<String> completedGoalNameList = [];
  List<String> completedGoalDescriptionList = [];
  List<String> completedGoalDateList = [];

  final goalDetailsController = TextEditingController();
  final goalNameController = TextEditingController();

  DateTime _currentDate = DateTime.now();


  // TODO: Update chartData values using GET request when backend is implemented
  // Sample Data to Test
  List<int> totalSessions = [19, 13];
  List<int> currentSessions = [10, 6];
  List<int> missedSessions = [3, 1];
  List<int> upcomingSessions = [6, 6];

  final List<List<ChartData>> chartData = [
    [
      ChartData('Current Sessions', 10, ((10 / 19) * 100).toStringAsFixed(1) + " %", Color.fromRGBO(9, 0, 136, 1.0)),
      ChartData('Missed Sessions', 3, ((3 / 19) * 100).toStringAsFixed(1) + " %", Color.fromRGBO(228, 0, 124, 1)),
      ChartData('Upcoming Sessions', 6, ((6 / 19) * 100).toStringAsFixed(1) + " %", Color.fromRGBO(255, 189, 57, 1))
    ],
    [
      ChartData('Current Sessions', 6, ((6 / 13) * 100).toStringAsFixed(1) + " %", Color.fromRGBO(9, 0, 136, 1.0)),
      ChartData('Missed Sessions', 1, ((1 / 13) * 100).toStringAsFixed(1) + " %", Color.fromRGBO(228, 0, 124, 1)),
      ChartData('Upcoming Sessions', 6, ((6 / 13) * 100).toStringAsFixed(1) + " %", Color.fromRGBO(255, 189, 57, 1))
    ]
  ];

  void updatePieChartData() {
    for (int i = 0; i < global.menteeList.length; i++) {
      chartData[i].add(ChartData('Current Sessions', currentSessions[i].toDouble(),
          ((currentSessions[i] / totalSessions[i]) * 100).toStringAsFixed(1) + " %", Color.fromRGBO(9, 0, 136, 1.0)));
      chartData[i].add(ChartData('Missed Sessions', missedSessions[i].toDouble(),
          ((missedSessions[i] / totalSessions[i]) * 100).toStringAsFixed(1) + " %", Color.fromRGBO(228, 0, 124, 1)));
      chartData[i].add(ChartData('Upcoming Sessions', upcomingSessions[i].toDouble(),
          ((upcomingSessions[i] / totalSessions[i]) * 100).toStringAsFixed(1) + " %", Color.fromRGBO(255, 189, 57, 1)));
    }
  }
  // END sample data

  void updateToken(String? token) {
    setState(() {
      _token = token;
    });
  }

  void updateID(int? id) {
    setState(() {
      _id = id;
      global.mentorID = id!;
    });
  }

  void updateMenteeList(List<List<String>>? token) {
    setState(() {
      menteeList = token![0];
      global.menteeList = token[0]; // assign global variable
      menteeIdList = token[1].map((data) => int.parse(data)).toList();
      global.menteeIdList = token[1].map((data) => int.parse(data)).toList();
    });
  }

  // Update data in goal lists
  void updateSessionsData(List<dynamic>? data) {
    goalNameList = [];
    goalDescriptionList = [];
    goalDateList = [];

    setState(() {
      for (int i = 0; i < data!.length; i++) {
        GoalsData fact = GoalsData.fromJson(data[i]);

        if (fact.mentor == global.mentorID) {
          if (fact.status == "IN PROGRESS") {
            goalNameList.add(fact.title);
            goalDescriptionList.add(fact.content);
            goalDateList.add(DateFormat('MMMM dd, yyyy').format(fact.date).toString());
          } else if (fact.status == "ACHIEVED") {
            completedGoalNameList.add(fact.title);
            completedGoalDescriptionList.add(fact.content);
            completedGoalDateList.add(DateFormat('MMMM dd, yyyy').format(fact.date).toString());
          }
        }
      }
    });
  }

  @override
  void initState() {
    getTokenPreference().then(updateToken);
    getIDPreference().then(updateID);
    getMenteeList().then(updateMenteeList);
    getSessions().then(updateSessionsData);

    super.initState();
  }

// Controller for text input in Notes
  @override
  void dispose() {
    // Clean up the controller when the widget is disposed.
    goalDetailsController.dispose();
    goalNameController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: TopBar(),
      body: Container(
        decoration: const BoxDecoration(
          color: Color(0xedffffff),
        ),
        child: ListView(
          padding: EdgeInsets.only(top: 10, left: 10, right: 10, bottom: 10),
          children: <Widget>[
            //Text('Key:'),
            //Text(_token ?? " "),
            //Text('${_id}'),
            //test(),
            welcomeText(),
            Calender(),
            menteeTitle(),
            menteePieChart(),
            goals(),
            goalsPopup(),
            completedGoals(),
          ],
        ),
      ),
    );
  }

  AppBar TopBar() {
    return AppBar(
      title: const Text('Home'),
      centerTitle: true,
      backgroundColor: const Color(0xff5ab031),
      automaticallyImplyLeading: false,
      leading: IconButton(
        iconSize: 32.0,
        icon: Icon(Icons.notifications),
        onPressed: () {
          Navigator.of(context).pushAndRemoveUntil(MaterialPageRoute(builder: (BuildContext context) => MessagesPage()), (Route<dynamic> route) => false);
        },
      ),
      actions: <Widget>[
        TextButton(
          onPressed: () {
            sharedPreferences?.clear();
            sharedPreferences?.commit();
            Navigator.of(context).pushAndRemoveUntil(MaterialPageRoute(builder: (BuildContext context) => LoginPage()), (Route<dynamic> route) => false);
          },
          child: Text("Log Out", style: TextStyle(color: Colors.white)),
        ),
      ],
    );
  }

  Container welcomeText() {
    return Container(
        child: Padding(
            padding: EdgeInsets.only(top: 5, bottom: 10),
            child: Text(
              "Welcome " + global.mentorID.toString() + "!",
              style: TextStyle(color: Colors.black, fontSize: 25, fontWeight: FontWeight.bold),
            )));
  }

  Container Calender() {
    return Container(
        child: Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: <Widget>[
        DatePicker(
          DateTime.now(),
          initialSelectedDate: DateTime.now(),
          selectionColor: Colors.pinkAccent,
          selectedTextColor: Colors.white,
          onDateChange: (date) {
            // New date selected
            setState(() {
              _currentDate = date;
            });
          },
        ),
      ],
    ));
  }

  Container menteeTitle() {
    return Container(
        child: Padding(
            padding: EdgeInsets.only(top: 35, bottom: 10),
            child: Text(
              "My Mentee: ",
              style: TextStyle(color: Colors.black, fontSize: 22, fontWeight: FontWeight.bold),
            )));
  }

  // Pie chart to show session statistics
  Container buildChart(int i) {
    return Container(
      child: SfCircularChart(margin: EdgeInsets.only(top: 0),
          //borderColor: Colors.blue,
          annotations: <CircularChartAnnotation>[
            CircularChartAnnotation(
                widget: Container(child: Text('Total: ' + totalSessions[i].toString(), style: TextStyle(color: Color.fromRGBO(0, 0, 0, 0.5), fontSize: 25))))
          ], series: <CircularSeries>[
        DoughnutSeries<ChartData, String>(
            dataSource: chartData[i],
            pointColorMapper: (ChartData data, _) => data.color,
            xValueMapper: (ChartData data, _) => data.x,
            yValueMapper: (ChartData data, _) => data.y,
            dataLabelMapper: (ChartData data, _) => data.text,
            dataLabelSettings: DataLabelSettings(
                isVisible: true,
                labelPosition: ChartDataLabelPosition.outside,
                // Renders background rectangle and fills it with series color
                useSeriesColor: true),
            // Radius of doughnut
            innerRadius: '80%',
            radius: '70%')
      ]),
    );
  }

  // Expansion drop down with pie chart
  Container menteePieChart() {
    return Container(
        child: Column(
      children: [
        for (var i = 0; i < global.menteeList.length; i++)
          new Column(
            children: [
              Divider(
                height: 2,
                color: Colors.grey,
              ),
              ExpansionTile(
                tilePadding: EdgeInsets.zero,
                //backgroundColor: Colors.yellow[50],
                backgroundColor: Color(0xffedfae5),
                initiallyExpanded: false,
                //backgroundColor: Colors.yellow[50],
                title: Text(
                  global.menteeList[i],
                  style: TextStyle(
                    color: Colors.black,
                    fontSize: 19,
                  ),
                  textAlign: TextAlign.left,
                ),
                children: [
                  buildChart(i),
                  pieChartLabels(i),
                  Padding(padding: EdgeInsets.only(bottom: 10)),
                ],
              ),
              Divider(
                height: 2,
                color: Colors.grey,
              ),
              Padding(padding: EdgeInsets.only(bottom: 10)),
            ],
          ),
      ],
    ));
  }

  Container pieChartLabels(int i) {
    return Container(
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: <Widget>[
          box("Current:", Color.fromRGBO(9, 0, 136, 1), currentSessions[i]),
          box("Missed:", Color.fromRGBO(228, 0, 124, 1), missedSessions[i]),
          box("Upcoming:", Color.fromRGBO(255, 189, 57, 1), upcomingSessions[i]),
        ],
      ),
    );
  }

  // Box for labels
  Container box(String text, Color color, int value) {
    return Container(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Align(
            alignment: Alignment.topLeft,
            child: Container(
              child: Text(
                text,
                textAlign: TextAlign.left,
              ),
            ),
          ),
          Container(
            height: 40.0,
            width: (MediaQuery.of(context).size.width / 3) - 30,
            color: Colors.transparent,
            child: new Container(
                decoration: new BoxDecoration(
                    color: color,
                    borderRadius: new BorderRadius.only(
                      topLeft: const Radius.circular(8.0),
                      topRight: const Radius.circular(8.0),
                      bottomRight: const Radius.circular(8.0),
                      bottomLeft: const Radius.circular(8.0),
                    )),
                child: new Center(
                  child: new Text(
                    value.toString(),
                    style: TextStyle(
                      color: Colors.white,
                    ),
                  ),
                )),
          ),
        ],
      ),
    );
  }

  // Create new goal
  Container goals() {
    return Container(
      child: Padding(
        padding: EdgeInsets.only(top: 20),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Padding(
              padding: EdgeInsets.only(top: 10),
              child: Text("Goals: ", style: TextStyle(color: Colors.black, fontSize: 24, fontWeight: FontWeight.bold)),
            ),
            ElevatedButton(
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
                            Form(
                              child: Container(
                                width: width - 25,
                                height: height / 1.75,
                                child: SingleChildScrollView(
                                  child: Column(
                                    mainAxisSize: MainAxisSize.min,
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: <Widget>[
                                      Padding(
                                        padding: EdgeInsets.only(top: 8, left: 0, right: 0, bottom: 2),
                                        child: Text(
                                          "ADD NEW GOAL",
                                          textAlign: TextAlign.left,
                                          style: new TextStyle(
                                            fontSize: 18.0,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                      ),
                                      Padding(
                                        padding: EdgeInsets.only(top: 25, left: 0, right: 0, bottom: 5),
                                        child: Text(
                                          "Goal Name:",
                                          textAlign: TextAlign.left,
                                          style: new TextStyle(
                                            fontSize: 19.0,
                                          ),
                                        ),
                                      ),
                                      Padding(
                                        padding: EdgeInsets.only(top: 0, left: 0, right: 0, bottom: 0),
                                        child: new TextField(
                                          controller: goalNameController,
                                          keyboardType: TextInputType.multiline,
                                          //expands: true,
                                          maxLines: 1,
                                          decoration: new InputDecoration(
                                            focusedBorder: OutlineInputBorder(
                                              borderSide: BorderSide(color: Colors.greenAccent, width: 1.0),
                                            ),
                                            enabledBorder: OutlineInputBorder(
                                              borderSide: BorderSide(color: Colors.greenAccent, width: 1.0),
                                            ),
                                          ),
                                        ),
                                      ),
                                      Padding(
                                        padding: EdgeInsets.only(top: 18, left: 0, right: 0, bottom: 5),
                                        child: Text(
                                          "Goal Details: ",
                                          textAlign: TextAlign.left,
                                          style: new TextStyle(
                                            fontSize: 19.0,
                                          ),
                                        ),
                                      ),
                                      Padding(
                                        padding: EdgeInsets.only(top: 0, left: 0, right: 0, bottom: 0),
                                        child: new TextField(
                                          controller: goalDetailsController,
                                          keyboardType: TextInputType.multiline,
                                          //expands: true,
                                          maxLines: 5,
                                          decoration: new InputDecoration(
                                            focusedBorder: OutlineInputBorder(
                                              borderSide: BorderSide(color: Colors.greenAccent, width: 1.0),
                                            ),
                                            enabledBorder: OutlineInputBorder(
                                              borderSide: BorderSide(color: Colors.greenAccent, width: 1.0),
                                            ),
                                          ),
                                        ),
                                      ),
                                      addGoalButton(),
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
              child: Icon(Icons.add, color: Colors.white),
              style: ElevatedButton.styleFrom(
                shape: CircleBorder(),
                padding: EdgeInsets.all(0),
                primary: Color(0xffff50a1), // <-- Button color
                onPrimary: Colors.black, // <-- Splash color
              ),
            ),
          ],
        ),
      ),
    );
  }

  Container addGoalButton() {
    //String Token = _token!;
    int Mentor = global.mentorID;
    String Date = DateFormat('yyyy-MM-dd').format(DateTime.now());

    return Container(
      margin: const EdgeInsets.only(top: 40.0),
      child: Align(
        alignment: Alignment.bottomCenter,
        child: RaisedButton(
          onPressed: () {
            if (goalNameController.text.isEmpty) {
              showErrorDialog(context, "Enter Goal Name!");
            } else if (goalDetailsController.text.isEmpty) {
              showErrorDialog(context, "Enter Goal Details!");
            } else {
              showAlertDialog(context, Mentor, Date);
            }
          },
          child: const Text('Add Goal', style: TextStyle(fontSize: 20)),
          color: const Color(0xffff50a1),
          textColor: Colors.white,
          elevation: 0.0,
        ),
      ),
    );
  }

  // Send data with POST request
  submitData(int mentor, String goalName, goalDetail, date) async {
    var response = await http.post(
      //Uri.parse("http://ptsv2.com/t/70iw7-1635724230/post"),
      Uri.parse("http://192.168.4.249:8000" + "/goals/goal/"),
      body: jsonEncode(
          {'mentor': mentor, 'mentee': null, 'title': goalName, 'date': date, 'goal_review_date': date, 'content': goalDetail, 'status': "IN PROGRESS"}),
      headers: {'Content-Type': 'application/json'},
    );
    if (response.statusCode == 400) {
      print("Error 400");
    } else if (response.statusCode == 200 || response.statusCode == 201) {
      Navigator.of(context).pushAndRemoveUntil(MaterialPageRoute(builder: (BuildContext context) => MyBottomNavigationBar()), (Route<dynamic> route) => false);
    }
  }

  // update id
  updateGoal(int mentor, String goalName, goalDetail, date) async {
    DateFormat format = new DateFormat("MMMM dd, yyyy");
    String formattedDate = DateFormat('yyyy-MM-dd').format(format.parse(date));
    var response = await http.patch(
      //Uri.parse("http://ptsv2.com/t/70iw7-1635724230/post"),
      Uri.parse("http://192.168.4.249:8000" + "/goals/goal/1"),
      body: jsonEncode(
          {'mentor': mentor,
            'mentee': null,
            'title': goalName,
            'date': formattedDate,
            'goal_review_date': formattedDate,
            'content': goalDetail,
            'status': "ACHIEVED"}),
      headers: {'Content-Type': 'application/json'},
    );
    print(response.statusCode);
    if (response.statusCode == 400) {
      print("Error 400");
    } else if (response.statusCode == 200 || response.statusCode == 201) {
      Navigator.of(context).pushAndRemoveUntil(MaterialPageRoute(builder: (BuildContext context) => MyBottomNavigationBar()), (Route<dynamic> route) => false);
    }
  }


  // Confirm dialog when creating a new goal
  showAlertDialog(BuildContext context, int Mentor, String Date) {
    // set up the buttons
    Widget cancelButton = TextButton(
      child: Text("Cancel"),
      onPressed: () => Navigator.pop(context),
    );
    Widget continueButton = TextButton(
      child: Text("Submit"),
      onPressed: () {
        submitData(Mentor, goalNameController.text, goalDetailsController.text, Date);
      },
    );
    // set up the AlertDialog
    AlertDialog alert = AlertDialog(
      title: Text("Add Goal"),
      content: Text("Would you like to create this goal?"),
      actions: [
        cancelButton,
        continueButton,
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

  // Confirm dialog when setting goal as complete
  showGoalAlertDialog(BuildContext context, int mentor, String goalName, goalDetail, date) {
    // set up the buttons
    Widget cancelButton = TextButton(
      child: Text("Cancel"),
      onPressed: () => Navigator.pop(context),
    );
    Widget continueButton = TextButton(
      child: Text("Submit"),
      onPressed: () {
        // TO DO: IMPLEMENT: Change Goal from In-Progress to Achieved
        // submitGoalData(Mentor);
        updateGoal(mentor, goalName, goalDetail, date);
      },
    );
    // set up the AlertDialog
    AlertDialog alert = AlertDialog(
      title: Text("Complete Goal"),
      content: Text("Mark goal as completed?"),
      actions: [
        cancelButton,
        continueButton,
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

  // Dialog for error messages
  showErrorDialog(BuildContext context, String errorMessage) {
    // set up the buttons
    Widget cancelButton = TextButton(
      child: Text("Dismiss"),
      onPressed: () => Navigator.pop(context),
    );

    // set up the AlertDialog
    AlertDialog alert = AlertDialog(
      title: Text("Error!"),
      content: Text(errorMessage),
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

  // Popup for active goals
  Container goalsPopup() {
    return Container(
      margin: EdgeInsets.only(top: 10),
      // child: ButtonTheme(
      child: Column(
        children: [
          for (var i = 0; i < goalNameList.length; i++)
            // ignore: unnecessary_new
            new Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                Expanded(
                  flex: 1,
                  child: Container(
                    child: ElevatedButton(
                      //padding: EdgeInsets.only(top: 12, left: 5, right: 5, bottom: 12),
                      style: ElevatedButton.styleFrom(
                        primary: Color(0xFFCFEAAD), // <-- Button color
                        onPrimary: Colors.black, // <-- Splash color
                      ),
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
                                    Form(
                                      child: Container(
                                        width: width - 25,
                                        height: height / 4.5,
                                        child: SingleChildScrollView(
                                          child: Column(
                                            mainAxisSize: MainAxisSize.min,
                                            crossAxisAlignment: CrossAxisAlignment.start,
                                            children: <Widget>[
                                              Padding(
                                                padding: EdgeInsets.only(top: 8, left: 0, right: 0, bottom: 2),
                                                child: Text(
                                                  goalNameList[i],
                                                  textAlign: TextAlign.left,
                                                  style: new TextStyle(
                                                    fontSize: 20.0,
                                                    fontWeight: FontWeight.bold,
                                                  ),
                                                ),
                                              ),
                                              Padding(
                                                padding: EdgeInsets.only(top: 8, left: 0, right: 0, bottom: 2),
                                                child: Text(
                                                  goalDateList[i],
                                                  textAlign: TextAlign.left,
                                                  style: new TextStyle(
                                                    fontSize: 18.0,
                                                    fontWeight: FontWeight.bold,
                                                  ),
                                                ),
                                              ),
                                              Padding(
                                                padding: EdgeInsets.only(top: 8, left: 0, right: 0, bottom: 20),
                                                child: Text(
                                                  goalDescriptionList[i],
                                                  textAlign: TextAlign.left,
                                                  style: new TextStyle(
                                                    fontSize: 19.0,
                                                  ),
                                                ),
                                              ),
                                              Align(
                                                alignment: Alignment.center,
                                                child: markGoalAsCompleted(global.mentorID, goalNameList[i], goalDescriptionList[i], goalDateList[i]),
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
                      child: Padding(
                        padding: EdgeInsets.only(top: 10, left: 0, right: 0, bottom: 10),
                        child: Align(
                          alignment: Alignment.centerLeft,
                          child: Text(
                            (i + 1).toString() + ". " + goalNameList[i],
                            style: new TextStyle(fontSize: 18.0),
                          ),
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

  Container markGoalAsCompleted(int mentor, String goalName, goalDetail, date) {
    return Container(
      child: OutlinedButton(
        onPressed: () {
          showGoalAlertDialog(context, mentor, goalName, goalDetail, date);
        },
        child: Text(
          'Mark as Complete?',
          style: new TextStyle(
            color: Colors.pinkAccent,
          ),
        ),
        style: OutlinedButton.styleFrom(
          shape: StadiumBorder(),
        ),
      ),
    );
  }

  // Popup for completed goals
  Container completedGoalsPopup() {
    return Container(
      margin: EdgeInsets.only(top: 0, bottom: 10),
      // child: ButtonTheme(
      child: Column(
        children: [
          for (var i = 0; i < completedGoalNameList.length; i++)
            // ignore: unnecessary_new
            new Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                Expanded(
                  flex: 1,
                  child: Container(
                    child: ElevatedButton(
                      //padding: EdgeInsets.only(top: 12, left: 5, right: 5, bottom: 12),
                      style: ElevatedButton.styleFrom(
                        primary: Color(0xFFEAEAE6), // <-- Button color
                        onPrimary: Colors.black, // <-- Splash color
                      ),
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
                                    Form(
                                      child: Container(
                                        width: width - 25,
                                        height: height / 5,
                                        child: SingleChildScrollView(
                                          child: Column(
                                            mainAxisSize: MainAxisSize.min,
                                            crossAxisAlignment: CrossAxisAlignment.start,
                                            children: <Widget>[
                                              Padding(
                                                padding: EdgeInsets.only(top: 8, left: 0, right: 0, bottom: 2),
                                                child: Text(
                                                  completedGoalNameList[i],
                                                  textAlign: TextAlign.left,
                                                  style: new TextStyle(
                                                    fontSize: 20.0,
                                                    fontWeight: FontWeight.bold,
                                                  ),
                                                ),
                                              ),
                                              Padding(
                                                padding: EdgeInsets.only(top: 8, left: 0, right: 0, bottom: 2),
                                                child: Text(
                                                  completedGoalDateList[i],
                                                  textAlign: TextAlign.left,
                                                  style: new TextStyle(
                                                    fontSize: 18.0,
                                                    fontWeight: FontWeight.bold,
                                                  ),
                                                ),
                                              ),
                                              Padding(
                                                padding: EdgeInsets.only(top: 8, left: 0, right: 0, bottom: 20),
                                                child: Text(
                                                  completedGoalDescriptionList[i],
                                                  textAlign: TextAlign.left,
                                                  style: new TextStyle(
                                                    fontSize: 19.0,
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
                      child: Padding(
                        padding: EdgeInsets.only(top: 10, left: 0, right: 0, bottom: 10),
                        child: Align(
                          alignment: Alignment.centerLeft,
                          child: Text(
                            completedGoalNameList[i],
                            style: new TextStyle(fontSize: 18.0, color: Color(0xFF4B4A4A)),
                          ),
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

  // Display completed goals
  Container completedGoals() {
    return Container(
      child: Padding(
        padding: EdgeInsets.only(top: 10, left: 5, right: 5, bottom: 40),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Divider(
              height: 1,
              color: Colors.grey,
            ),
            ListTileTheme(
              contentPadding: EdgeInsets.all(0),
              dense: true,
              child: ExpansionTile(
                backgroundColor: Color(0xFFF3FFCC),
                title: Text(
                  'Completed Goals (' + completedGoalNameList.length.toString() + ')',
                  style: TextStyle(
                    color: Colors.black,
                    fontSize: 16,
                  ),
                  textAlign: TextAlign.left,
                ),
                children: [
                  Padding(
                    padding: EdgeInsets.only(top: 3, left: 8, right: 8),
                    child: completedGoalsPopup(),
                  )
                ],
              ),
            ),
            Divider(
              height: 1,
              color: Colors.grey,
            ),
          ],
        ),
      ),
    );
  }

  // TO BE DELETED .......
  Container test() {
    return Container(
      child: Padding(
        padding: EdgeInsets.only(top: 30, left: 0, right: 10),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            for (var i in menteeList)
              Text(
                i.toString(),
                textAlign: TextAlign.left,
                style: new TextStyle(
                  fontSize: 16.0,
                ),
              ),
            for (var i in menteeIdList)
              Text(
                i.toString(),
                textAlign: TextAlign.left,
                style: new TextStyle(
                  fontSize: 16.0,
                ),
              )
          ],
        ),
      ),
    );
  }
}
