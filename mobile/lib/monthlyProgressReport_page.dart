// ignore: file_names
// ignore_for_file: file_names

import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;

import 'navigation_bar.dart';

class MonthlyProgressPage extends StatefulWidget {
  @override
  _MonthlyProgressPageState createState() => _MonthlyProgressPageState();
}


// User token
Future<String?> getTokenPreference() async {
  SharedPreferences prefs = await SharedPreferences.getInstance();
  String? token = prefs.getString("token");
  return token;
}


// Get questions with GET request
Future<List<String>?> getQuestions() async {
  List<String> questions = [];

  var url = Uri.parse('http://192.168.4.251:8000/monthly-report/get-report/');
  http.Response response = await http.get(url);
  try {
    if (response.statusCode == 200) {
      String data = response.body;
      var jsonData = json.decode(data) as Map<String, dynamic>;
      jsonData.forEach((k, v) {
        if ((v["Question"].toString() != "Mentor's Name")) {
          if (v["Question"].toString() != "Mentee's Name") {
            if (v["Question"].toString() != "Reporting Period (Month)") {
              questions.add(v["Question"]);
            }
          }
        }
      });
      return questions;
      // return decodedData;
    }
  } catch (e) {
    return questions;
  }
}

// Get number of questions
Future<int?> getNumberOfQuestions(List<String> list) async {
  int numberOfQuestions = list.length;
  return numberOfQuestions;
}

class _MonthlyProgressPageState extends State<MonthlyProgressPage> {


  // Pre-initialized variables
  String? _token = "";
  int? _number = 1;
  SharedPreferences? sharedPreferences;
  String dropdownValue = "Select a mentee";
  List<String> mentees = ["-", "1", "2", "3", "4", "5"];
  String selectedMonth = DateFormat('MMMM').format(DateTime.now());
  List<String> questionsList = [" "];
  List<String> mentorInput = List.filled(20, "-");

/*  List<String> questionsList = [
    "My mentee is engaging well with mentoring sessions",
    "My mentee arrives on time ",
    "My mentee is willing to engage in activites",
    "My mentee feels postive about herself"
  ];*/


// get user token
  void updateToken(String? token) {
    setState(() {
      _token = token;
    });
  }

  // update Questions lists
  void updateQuestions(List<String>? token) {
    setState(() {
      questionsList = token!;
      _number = token.length;
      mentorInput = List.filled(_number!, "-");
    });
  }

  @override
  void initState() {
    getTokenPreference().then(updateToken);
    getQuestions().then(updateQuestions);

    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
        future: getQuestions(),
        builder: (context, snapshot) {
          if (snapshot.hasData) {
            return Scaffold(
              resizeToAvoidBottomInset: false,
              appBar: TopBar(),
              body: Container(
                decoration: const BoxDecoration(
                  color: Color(0xedffffff),
                ),
                child: Column(children: [
                  Expanded(
                    child: ListView(
                      padding: EdgeInsets.only(top: 5, left: 10, right: 10),
                      children: <Widget>[
                        DropDownMenteeList(),
                        DropDownMenuMonth(),
                        // helpIcon(),
                        showQuestions(),
                        submit(),
                        //Text('Key :'),
                        //Text(_token ?? " "),
                      ],
                    ),
                  ),
                  //helpIcon(),
                ]),
              ),
            );
          } else {
            // if data not loaded yet
            return showLoadingAnimation();
          }
        });
  }

  // Loading Animation (for when data is still being loaded in using the get request)
  Container showLoadingAnimation() {
    return Container(
        alignment: Alignment.topCenter,
        margin: EdgeInsets.only(top: 30),
        child: LinearProgressIndicator(
          backgroundColor: Colors.lightGreenAccent,
          valueColor: AlwaysStoppedAnimation<Color>(Colors.green),
        ));
  }

  // Top header
  AppBar TopBar() {
    return AppBar(
      title: const Text('Monthly Progress Report'),
      centerTitle: true,
      backgroundColor: const Color(0xff5ab031),
      automaticallyImplyLeading: false,
    );
  }

  // Drop down menu to select mentees
  Container DropDownMenteeList() {
    List<String> mentees = ["Select a mentee", "User Name 1", _token ?? " "];
    return Container(
      margin: const EdgeInsets.only(bottom: 10.0),
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

  // Select Report month
  Container DropDownMenuMonth() {
    List<String> months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];

    return Container(
      margin: const EdgeInsets.only(bottom: 20.0),
      child: Row(
        children: <Widget>[
          Expanded(
            flex: 0,
            child: Text(
              'Reporting Period (Month):   ',
              style: new TextStyle(
                fontSize: 16.0,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          Expanded(
            flex: 1,
            child: Container(
                height: 40,
                child: DropdownButton<String>(
                  isExpanded: true,
                  value: selectedMonth,
                  icon: const Icon(Icons.arrow_drop_down),
                  iconSize: 25,
                  elevation: 16,
                  style: const TextStyle(color: Colors.black, fontSize: 16.0),
                  underline: Container(
                    height: 2,
                    color: Colors.green,
                  ),
                  onChanged: (String? newValue) {
                    setState(() {
                      selectedMonth = newValue!;
                    });
                  },
                  items: months.map<DropdownMenuItem<String>>((String value) {
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

  // Help Icon
  // To be implemented
  Tooltip helpIcon() {
    return Tooltip(
      message: 'Information',
      child: FlatButton(
        onPressed: () {},
        child: Icon(
          Icons.info_outline,
          size: 50,
          color: Colors.teal,
        ),
      ),
    );
  }

  // Display questions
  Container showQuestions() {
    int newnumber = questionsList.length;
    _number = newnumber;

    return Container(
      margin: const EdgeInsets.only(bottom: 10.0),
      child: Row(
        children: <Widget>[
          Expanded(
            flex: 6,
            child: Container(
              width: MediaQuery.of(context).size.width * 0.25,
              child: Column(
                children: questionsList.map((String data) {
                  return new Row(
                    children: [
                      Expanded(
                        flex: 5,
                        child: new ConstrainedBox(
                          constraints: new BoxConstraints(
                            minHeight: 45.0,
                          ),
                          child: Container(
                            padding: EdgeInsets.only(
                                left: 0, right: 0, top: 3, bottom: 0),
                            width: MediaQuery.of(context).size.width * 0.25,
                            child: Column(
                              children: [
                                Align(
                                  alignment: Alignment.topLeft,
                                  child: Container(
                                    margin: const EdgeInsets.only(top: 10.0),
                                    child: Text(
                                      data,
                                      style: new TextStyle(
                                        fontSize: 13.0,
                                      ),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ],
                  );
                }).toList(),
              ),
            ),
          ),
          Flexible(
            flex: 1,
            child: Container(
              width: MediaQuery.of(context).size.width * 0.25,
              child: Column(
                children: [
                  for (var i = 0; i < _number!; i++)
                    new Row(
                      children: [
                        Expanded(
                          flex: 3,
                          child: Container(
                            height: 45,
                            width: MediaQuery.of(context).size.width * 0.25,
                            child: Column(
                              children: [
                                Align(
                                  alignment: Alignment.centerRight,
                                  child: Container(
                                    child: DropDownMenuFeedback(i),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    )
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  // Mentor selects value from 1-5 for questions
  Container DropDownMenuFeedback(var i) {
    return Container(
      margin: const EdgeInsets.only(bottom: 0.0),
      child: Row(
        children: <Widget>[
          Flexible(
              child: Container(
            width: 50.0,
            padding: EdgeInsets.only(left: 4, right: 0, top: 0, bottom: 0),
            height: 45,
            child: DropdownButton<String>(
              isExpanded: true,
              value: mentorInput[i],
              icon: const Icon(Icons.arrow_drop_down),
              iconSize: 18,
              elevation: 16,
              style: const TextStyle(color: Colors.black, fontSize: 15.0),
              underline: Container(
                height: 2,
                color: Colors.green,
              ),
              onChanged: (String? newValue) {
                setState(() {
                  mentorInput[i] = newValue!;
                });
              },
              items: mentees.map<DropdownMenuItem<String>>((String value) {
                return DropdownMenuItem<String>(
                  value: value,
                  child: Text(value),
                );
              }).toList(),
            ),
          )),
        ],
      ),
    );
  }

  // Submit button
  Container submit() {
    String Token = _token!;
    String Mentee = dropdownValue;
    String Month = selectedMonth;
    String Questions = questionsList.toString();
    String Answers = mentorInput.toString();

    return Container(
      margin: const EdgeInsets.only(top: 40.0),
      child: Align(
        alignment: Alignment.bottomCenter,
        child: RaisedButton(
          onPressed: () {
            if (Mentee == "Select a mentee") {
              showErrorDialog(context, "Select a mentee");
            } else if (mentorInput.contains("-")) {
              showErrorDialog(context, "Complete the questionnaire!");
            } else {
              showAlertDialog(
                  context, Token, Mentee, Month, Questions, Answers);
            }
          },
          child: const Text('Submit Session', style: TextStyle(fontSize: 20)),
          color: const Color(0xff5ab031),
          textColor: Colors.white,
          elevation: 0.0,
        ),
      ),
    );
  }


  // Submit data to online server
  // Change URL to project server
  submitData(String token, mentee, month, questions, mentorInput) async {
    SharedPreferences sharedPreferences = await SharedPreferences.getInstance();
    Map data = {
      'token': token,
      'mentee': mentee,
      'month': month,
      'questions': questions,
      'mentorInput': mentorInput,
    };
    var response = await http.post(
        Uri.parse("http://ptsv2.com/t/70iw7-1635724230/post"),
        body: data);

    if (response.statusCode == 400) {
      print("Error 400");
    } else if (response.statusCode == 200) {
      Navigator.of(context).pushAndRemoveUntil(
          MaterialPageRoute(
              builder: (BuildContext context) => MyBottomNavigationBar()),
          (Route<dynamic> route) => false);
    }
  }

  // Dialog to confirm submission
  showAlertDialog(BuildContext context, String token, mentee, month, questions,
      mentorInput) {
    Widget cancelButton = TextButton(
      child: Text("Cancel"),
      onPressed: () => Navigator.pop(context),
    );
    Widget continueButton = TextButton(
      child: Text("Submit"),
      onPressed: () {
        submitData(token, mentee, month, questions, mentorInput);
      },
    );

    AlertDialog alert = AlertDialog(
      title: Text("Submit Progress Report"),
      content: Text(
          "Would you like to continue and submit the current progress report?"),
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
} // End
