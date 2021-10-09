import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;
import 'package:baytree_mobile/login_page.dart';
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
      appBar: AppBar(
        title: const Text('Home Page'),
        backgroundColor: const Color(0xff5ab031),
        actions: <Widget>[
          FlatButton(
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
      ),
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
}
