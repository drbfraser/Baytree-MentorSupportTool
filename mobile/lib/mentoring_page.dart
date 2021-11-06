import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:async';
import 'package:intl/intl.dart';
import 'package:http/http.dart' as http;
import 'navigation_bar.dart';

class MentoringPage extends StatefulWidget {
  @override
  _MentoringPageState createState() => _MentoringPageState();
}

Future<String?> getTokenPreference() async {
  SharedPreferences prefs = await SharedPreferences.getInstance();
  String? token = prefs.getString("token");
  return token;
}

extension TimeOfDayExtension on TimeOfDay {
  TimeOfDay addHour(int hour) {
    return this.replacing(hour: this.hour + hour, minute: this.minute);
  }
}

class _MentoringPageState extends State<MentoringPage> {

  // Variables:
  String? _token = "";
  SharedPreferences? sharedPreferences;

  final notesController = TextEditingController();

  bool attendance = true;

  TimeOfDay _startTime = TimeOfDay.now();
  TimeOfDay _endTime = TimeOfDay.now().addHour(1);
  late TimeOfDay startTimeSelected;
  late TimeOfDay endTimeSelected;

  DateTime pickedDate = DateTime.now();

  // Starting value for drop down menu
  String dropdownValue = "Select a mentee";


  // Controller for text input in Notes
  @override
  void dispose() {
    // Clean up the controller when the widget is disposed.
    notesController.dispose();
    super.dispose();
  }

  // Select start time
  Future<Null> selectStartTime(BuildContext context) async {
    startTimeSelected = (await showTimePicker(
      context: context,
      initialTime: _startTime,
    ))!;

    setState(() {
      _startTime = startTimeSelected;
    });
  }

  // Select end time
  Future<Null> selectEndTime(BuildContext context) async {
    endTimeSelected = (await showTimePicker(
      context: context,
      initialTime: _endTime,
    ))!;

    setState(() {
      _endTime = endTimeSelected;
    });
  }

  // Select date
  Future<String?> _pickDate() async {
    DateTime? date = await showDatePicker(
      context: context,
      initialDate: pickedDate,
      lastDate: DateTime(DateTime.now().year + 1),
      firstDate: DateTime(DateTime.now().year - 1),
    );

    if (date != null) {
      setState(() {
        pickedDate = date;
      });
    }
  }

  // get user token
  void updateToken(String? token) {
    setState(() {
      _token = token;
    });
  }

  @override
  void initState() {
    getTokenPreference().then(updateToken);
    super.initState();
  }


  @override
  Widget build(BuildContext context) {
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
                DropDownMenu(),
                StartDate(),
                startTime(),
                endTime(),
                Text(
                  'Notes:      ',
                  style: new TextStyle(
                    fontSize: 20.0,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                notes(),
                attendanceCheckBox(),
                submit(),

                //Text('Key :'),
                //Text(_token ?? " "),
              ],
            ),
          ),
        ]),
      ),
    );
  }

  AppBar TopBar() {
    return AppBar(
      title: const Text('New Mentoring Session'),
      centerTitle: true,
      backgroundColor: const Color(0xff5ab031),
      automaticallyImplyLeading: false,
    );
  }

  //List <String> mentees = ['One', "token" ?? " ", 'Free', 'Four'];
  //List <String> mentees = [token]

  // Drop down menu to select mentee
  // Change "List<String> mentees" to a POST request for mentee names
  Container DropDownMenu() {
    List<String> mentees = ["Select a mentee", "User Name 1", _token ?? " "];
    return Container(
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
                  value: dropdownValue,
                  icon: const Icon(Icons.arrow_drop_down),
                  iconSize: 25,
                  elevation: 16,
                  style: const TextStyle(color: Colors.black, fontSize: 18.0),
                  underline: Container(
                    height: 3,
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

  // Select the start date
  Container StartDate() {
    String formattedDate = DateFormat('MMMM dd, yyyy').format(pickedDate);
    return Container(
      margin: const EdgeInsets.only(bottom: 10.0),
      child: Row(
        children: <Widget>[
          Expanded(
            flex: 0,
            child: Text(
              'Select Date:   ',
              style: new TextStyle(
                fontSize: 20.0,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          Expanded(
              flex: 1,
              child: Container(
                height: 20,
                alignment: Alignment.topLeft,
                child: TextButton(
                  style: TextButton.styleFrom(
                    textStyle: const TextStyle(fontSize: 18),
                    padding:
                    EdgeInsets.only(left: 10, right: 0, top: 0, bottom: 0),
                  ),
                  onPressed: () {
                    _pickDate();
                  },
                  child: Text(formattedDate,
                      style: TextStyle(
                        color: Colors.black,
                      )),
                ),
              )),
          Expanded(
              flex: 0,
              child: Container(
                  height: 20,
                  alignment: Alignment.topRight,
                  child: IconButton(
                    padding:
                    EdgeInsets.only(left: 0, right: 8, top: 0, bottom: 0),
                    constraints: BoxConstraints(),
                    icon: Icon(Icons.date_range),
                    onPressed: () {
                      _pickDate();
                    },
                  ))),
        ],
      ),
    );
  }

  // Select start time
  Container startTime() {
    String formattedTime = _startTime.format(context);
    return Container(
      margin: const EdgeInsets.only(bottom: 10.0),
      child: Row(
        children: <Widget>[
          Expanded(
            flex: 0,
            child: Text(
              'Start Time:    ',
              style: new TextStyle(
                fontSize: 20.0,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          Expanded(
              flex: 1,
              child: Container(
                height: 20,
                alignment: Alignment.topLeft,
                child: TextButton(
                  style: TextButton.styleFrom(
                    alignment: Alignment.topLeft,
                    textStyle: const TextStyle(fontSize: 18),
                    padding:
                    EdgeInsets.only(left: 10, right: 0, top: 0, bottom: 0),
                  ),
                  onPressed: () {
                    selectStartTime(context);
                  },
                  child: Text(
                    formattedTime,
                    style: TextStyle(
                      color: Colors.black,
                    ),
                  ),
                ),
              )),
          Expanded(
              flex: 0,
              child: Container(
                  height: 20,
                  alignment: Alignment.topRight,
                  child: IconButton(
                    padding:
                    EdgeInsets.only(left: 0, right: 8, top: 0, bottom: 0),
                    constraints: BoxConstraints(),
                    icon: Icon(Icons.alarm),
                    onPressed: () {
                      selectStartTime(context);
                    },
                  ))),
        ],
      ),
    );
  }

  // Select end time
  Container endTime() {
    String formattedTime = _endTime.format(context);
    return Container(
      margin: const EdgeInsets.only(bottom: 10.0),
      child: Row(
        children: <Widget>[
          Expanded(
            flex: 0,
            child: Text(
              'End Time:      ',
              style: new TextStyle(
                fontSize: 20.0,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          Expanded(
              flex: 1,
              child: Container(
                height: 20,
                alignment: Alignment.topLeft,
                child: TextButton(
                  style: TextButton.styleFrom(
                    textStyle: const TextStyle(fontSize: 18),
                    padding:
                    EdgeInsets.only(left: 10, right: 0, top: 0, bottom: 0),
                  ),
                  onPressed: () {
                    selectEndTime(context);
                  },
                  child: Text(
                    formattedTime,
                    style: TextStyle(
                      color: Colors.black,
                    ),
                  ),
                ),
              )),
          Expanded(
              flex: 0,
              child: Container(
                  height: 20,
                  alignment: Alignment.topRight,
                  child: IconButton(
                    padding:
                    EdgeInsets.only(left: 0, right: 8, top: 0, bottom: 0),
                    constraints: BoxConstraints(),
                    icon: Icon(Icons.alarm),
                    onPressed: () {
                      selectEndTime(context);
                    },
                  ))),
        ],
      ),
    );
  }

  // Text form for user notes
  Container notes() {
    return Container(
      margin: const EdgeInsets.only(top: 10.0),
      child: new TextField(
        controller: notesController,
        keyboardType: TextInputType.multiline,
        //expands: true,
        maxLines: 10,
        decoration: new InputDecoration(
          focusedBorder: OutlineInputBorder(
            borderSide: BorderSide(color: Colors.greenAccent, width: 1.0),
          ),
          enabledBorder: OutlineInputBorder(
            borderSide: BorderSide(color: Colors.red, width: 1.0),
          ),
        ),
      ),
    );
  }

  // Checkbox for mentee attendance
  // Default value: attendance = true
  Container attendanceCheckBox() {
    return Container(
        margin: const EdgeInsets.only(top: 1.0, bottom: 0.0, left: 0.0),
        child: FlatButton(
            materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
            padding: EdgeInsets.only(left: 10.0),
            onPressed: () => setState(() => attendance = !attendance),
            child: Row(mainAxisAlignment: MainAxisAlignment.start, children: [
              SizedBox(
                  height: 18.0,
                  width: 0.0,
                  child: Theme(
                      data: Theme.of(context).copyWith(
                        unselectedWidgetColor: Color(0xff5ab031),
                      ),
                      child: Checkbox(
                          checkColor: Colors.white,
                          activeColor: Color(0xff5ab031),
                          value: attendance,
                          onChanged: (value) {
                            setState(() => attendance = value!);
                          }))),
              SizedBox(width: 10.0),
              Text(
                "  Mentee Attendence",
                style: TextStyle(fontSize: 16),
              )
            ])));
  }

  // Submit data to online server
  // Change URL to project server
  submitData(
      String token, mentee, notes, date, start, end, menteeAttendance) async {
    SharedPreferences sharedPreferences = await SharedPreferences.getInstance();
    Map data = {
      'token': token,
      'mentee': mentee,
      'notes': notes,
      'date': date,
      'start': start,
      'end': end,
      'attendance': menteeAttendance
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
  showAlertDialog(
      BuildContext context, String Token, Mentee, Date, start, end) {
    // set up the buttons
    Widget cancelButton = TextButton(
      child: Text("Cancel"),
      onPressed: () => Navigator.pop(context),
    );
    Widget continueButton = TextButton(
      child: Text("Submit"),
      onPressed: () {
        submitData(Token, Mentee, notesController.text, Date, start, end,
            attendance.toString());
      },
    );
    // set up the AlertDialog
    AlertDialog alert = AlertDialog(
      title: Text("Submit Session"),
      content:
          Text("Would you like to continue and submit the current session?"),
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

  // Submit button
  Container submit() {
    String Token = _token!;
    String Mentee = dropdownValue;
    String Date = DateFormat('MMMM dd, yyyy').format(pickedDate);
    String start = _startTime.format(context);
    String end = _endTime.format(context);

    double _DoublestartTime =
        _startTime.hour.toDouble() + (_startTime.minute.toDouble() / 60);

    double _DoubleendTime =
        _endTime.hour.toDouble() + (_endTime.minute.toDouble() / 60);

    double _timeDiff = _DoubleendTime - _DoublestartTime;

    return Container(
      margin: const EdgeInsets.only(top: 40.0),
      child: Align(
        alignment: Alignment.bottomCenter,
        child: RaisedButton(
          onPressed: () {
            if (Mentee == "Select a mentee") {
              showErrorDialog(context, "Select a mentee");
            } else if (notesController.text.isEmpty) {
              showErrorDialog(context, "Missing Notes!");
            } else if (_timeDiff < 0) {
              showErrorDialog(context, "Invalid Time!");
            } else {
              showAlertDialog(context, Token, Mentee, Date, start, end);
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


} // end
