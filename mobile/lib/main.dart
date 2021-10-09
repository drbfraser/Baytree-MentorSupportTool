import 'dart:convert';

import 'package:baytree_mobile/mentoring_page.dart';
import 'package:baytree_mobile/messages_page.dart';
import 'package:baytree_mobile/records_page.dart';
import 'package:baytree_mobile/resources_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;
import 'package:baytree_mobile/login_page.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:baytree_mobile/home_page.dart';
import 'package:baytree_mobile/mentoring_page.dart';
import 'package:baytree_mobile/records_page.dart';
import 'package:baytree_mobile/resources_page.dart';
import 'package:baytree_mobile/messages_page.dart';

import 'navigation_bar.dart';


void main() {
  SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle(
    statusBarColor: const Color(0xff5ab031),
    statusBarIconBrightness: Brightness.dark,
  ));
  runApp(MyApp());
}

class MyApp extends StatelessWidget {

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: MainPage(),
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
          accentColor: Colors.white70
      ),
    );
  }
}

class MainPage extends StatefulWidget {
  @override
  _MainPageState createState() => _MainPageState();
}

class _MainPageState extends State<MainPage> {

  SharedPreferences? sharedPreferences;

  @override
  void initState() {
    super.initState();
    checkLoginStatus();
  }

  checkLoginStatus() async {
    sharedPreferences = await SharedPreferences.getInstance();
    if(sharedPreferences?.getString("token") == null) {
      Navigator.of(context).pushAndRemoveUntil(MaterialPageRoute(builder: (BuildContext context) => LoginPage()), (Route<dynamic> route) => false);
    } else {
      Navigator.of(context).pushAndRemoveUntil(MaterialPageRoute(builder: (BuildContext context) => MyBottomNavigationBar()), (Route<dynamic> route) => false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold();
  }


}
