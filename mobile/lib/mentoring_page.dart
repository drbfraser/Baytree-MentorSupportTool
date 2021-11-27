import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:async';
import 'package:intl/intl.dart';
import 'package:http/http.dart' as http;
import 'navigation_bar.dart';
import 'global_variables.dart' as global;

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
    if (this.hour != 23) {
      return this.replacing(hour: this.hour + hour, minute: this.minute);
    } else {
      return this.replacing(hour: this.hour, minute: this.minute);
    }
  }
}

class _MentoringPageState extends State<MentoringPage> {
  // Variables:
  String? _token = "";
  SharedPreferences? sharedPreferences;

  final notesController = TextEditingController();

  String dropDownValueAttendance = "Mentee did not attend";

  bool attendance = true;

  TimeOfDay _startTime = TimeOfDay.now();
  TimeOfDay _endTime = TimeOfDay.now().addHour(1);
  late TimeOfDay startTimeSelected;
  late TimeOfDay endTimeSelected;

  DateTime pickedDate = DateTime.now();

  // Starting value for drop down menu
  var dropdownValue;

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

  // Drop down menu to select mentee
  Container DropDownMenu() {
    List<String> mentees = global.menteeList; // global variables

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
                  hint: Text("Select a mentee"),
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
    List<String> dropDownOptions = ["Mentee did not attend", "Mentor did not attend"];
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
              if (attendance)
                Text(
                  "  Attendence",
                  style: TextStyle(fontSize: 16),
                )
              else
              Container(
                  margin: EdgeInsets.only(left: 10.0),
                    child: DropdownButton<String>(

                      hint: Text("Select a mentee"),
                      value: dropDownValueAttendance,
                      icon: const Icon(Icons.arrow_drop_down),
                      iconSize: 25,
                      elevation: 16,
                      style: const TextStyle(color: Colors.black, fontSize: 14.0),
                      onChanged: (String? newValue) {
                        setState(() {
                          dropDownValueAttendance = newValue!;
                        });
                      },
                      items: dropDownOptions.map<DropdownMenuItem<String>>((String value) {
                        return DropdownMenuItem<String>(
                          value: value,
                          child: Text(value),
                        );
                      }).toList(),
                    )),
            ])));
  }

  // Submit data to online server
  // Change URL to project server
  submitData(String token, mentee, notes, date, start, end,
      bool attendance) async {
    String startFormatted =
        DateFormat("HH:mm").format(DateFormat.jm().parse(start)).toString();
    String endFormatted =
        DateFormat("HH:mm").format(DateFormat.jm().parse(end)).toString();
    DateFormat format = new DateFormat("MMMM dd, yyyy");

    String formattedDate = DateFormat('yyyy-MM-dd').format(format.parse(date));

    String startTimeDate = formattedDate + " " + startFormatted + ":00";
    String endTimeDate = formattedDate + " " + endFormatted + ":00";

    bool menteeAttendance = true;
    bool mentorAttendance = true;

    print(attendance);

    if(attendance == false) {
      if(dropDownValueAttendance.contains("Mentee")){
        menteeAttendance = false;
      } else {
        mentorAttendance = false;
      }
    }

    print(mentorAttendance);
    print(menteeAttendance);
    int index = global.menteeList.indexOf(mentee);

    var response = await http.post(
      //Uri.parse("http://ptsv2.com/t/70iw7-1635724230/post"),
      Uri.parse("http://192.168.4.251:8000/sessions/"),
      body: jsonEncode({
        'id': 1,
        'created_at': date.toString(),
        'updated_at': "",
        'mentor': global.mentorID,
        'mentee': global.menteeIdList[index],
        'attended_by_mentor': mentorAttendance,
        'attended_by_mentee': menteeAttendance,
        'clock_in': startTimeDate,
        'clock_out': endTimeDate,
        'notes': notes
      }),
      headers: {'Content-Type': 'application/json'},
    );

    if (response.statusCode == 400) {
      print("Error 400");
    } else if (response.statusCode == 200 || response.statusCode == 201) {
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
        submitData(
            Token, Mentee, notesController.text, Date, start, end, attendance);
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
            if (Mentee == null) {
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
