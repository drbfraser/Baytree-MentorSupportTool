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


Future<List<String>?> getMenteeList() async {
  List<String> mentees = [];

  var url = Uri.parse('http://192.168.4.251:8000/users/mentors/2');
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
      }

      return mentees;
      // return decodedData;
    }
  } catch (e) {
    return mentees;
  }
}


class _HomePageState extends State<HomePage> {

  String? _token = "";
  SharedPreferences? sharedPreferences;

  List<String> menteeList = [" "];


  void updateToken(String? token) {
    setState(() {
      _token = token;
    });
  }

  void updateMenteeList(List<String>? token) {
    setState(() {
      menteeList = token!;
      global.menteeList = menteeList; // assign global variable
    });
  }


  @override
  void initState() {
    getTokenPreference().then(updateToken);
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
            ),)
    ],
    ),
      ),
    );
  }


}
