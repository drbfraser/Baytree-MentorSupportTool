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
  String urlMentorID = "http://192.168.4.251:8000/users/mentors/" + global.mentorID.toString();

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
      for(int i = 0; i < num; i++) {
        mentees.add(record.data.menteeUser[i].user.firstName + " " + record.data.menteeUser[i].user.lastName);
        id.add(record.data.menteeUser[i].user.id.toString());
      }

      return [mentees, id ];
      // return decodedData;
    }
  } catch (e) {
    return [mentees, id ];
  }
}


class _HomePageState extends State<HomePage> {

  SharedPreferences? sharedPreferences;

  // Initialize variables
  String? _token = "";
  int? _id = 0;

  List<String> menteeList = [" "];
  List<int> menteeIdList = [];


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


  @override
  void initState() {
    getTokenPreference().then(updateToken);
    getIDPreference().then(updateID);
    getMenteeList().then(updateMenteeList);

    super.initState();
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
          padding: EdgeInsets.only(top: 10, left: 10),
          children: <Widget>[
            Text('Key:'),
            Text(_token ?? " "),
            Text('${_id}'),
            test(),

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
      leading: IconButton (
        iconSize: 32.0,
        icon: Icon(Icons.notifications  ),
        onPressed: () {
          Navigator.of(context).pushAndRemoveUntil(
              MaterialPageRoute(
                  builder: (BuildContext context) => MessagesPage()),
                  (Route<dynamic> route) => false);
        },
      ),
      actions: <Widget>[
        TextButton(
          onPressed: () {
            sharedPreferences?.clear();
            sharedPreferences?.commit();
            Navigator.of(context).pushAndRemoveUntil(
                MaterialPageRoute(
                    builder: (BuildContext context) => LoginPage()),
                    (Route<dynamic> route) => false);
          },
          child: Text("Log Out", style: TextStyle(color: Colors.white)),
        ),

      ],

    );

  }

  Container test() {
    return Container(
      child: Padding(
        padding: EdgeInsets.only(top: 30, left: 0, right: 10),
        child: Column (
          crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          for ( var i in menteeList ) Text(i.toString(),
            textAlign: TextAlign.left,
            style: new TextStyle(
              fontSize: 16.0,
            ),),
          for ( var i in menteeIdList ) Text(i.toString(),
            textAlign: TextAlign.left,
            style: new TextStyle(
              fontSize: 16.0,
            ),)
    ],
    ),
      ),
    );
  }


}
