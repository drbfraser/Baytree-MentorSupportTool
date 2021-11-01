import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;
import 'package:baytree_mobile/login_page.dart';
import 'package:baytree_mobile/messages_page.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'main.dart';

class HomePage extends StatefulWidget {
  @override
  _HomePageState createState() => _HomePageState();
}

Future<String?> getTokenPreference() async {
  SharedPreferences prefs = await SharedPreferences.getInstance();
  String? token = prefs.getString("token");
  return token;
}

class _HomePageState extends State<HomePage> {

  String? _token = "";
  SharedPreferences? sharedPreferences;

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



}
