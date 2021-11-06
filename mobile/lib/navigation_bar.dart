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
import 'package:baytree_mobile/monthlyProgressReport_page.dart';
import 'package:titled_navigation_bar/titled_navigation_bar.dart';


class MyBottomNavigationBar extends StatefulWidget {

  @override
  _MyBottomNavigationBarState createState() => _MyBottomNavigationBarState();
}

class _MyBottomNavigationBarState extends State<MyBottomNavigationBar> {

  SharedPreferences? sharedPreferences;

  @override
  void initState() {
    super.initState();
    checkLoginStatus();
  }

  checkLoginStatus() async {
    sharedPreferences = await SharedPreferences.getInstance();
    if (sharedPreferences?.getString("token") == null) {
      Navigator.of(context).pushAndRemoveUntil(
          MaterialPageRoute(builder: (BuildContext context) => LoginPage()),
              (Route<dynamic> route) => false);
    }
  }

  int _currentIndex = 0;

  final List<Widget> _children = [
    HomePage(),
    MentoringPage(),
    MonthlyProgressPage(),
    RecordsPage(),
    ResourcesPage(),
    MessagesPage()
  ];

  void onTappedBar(int index) {
    setState(() {
      _currentIndex = index;
    });
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _children[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        onTap: onTappedBar,
        currentIndex: _currentIndex,
        showUnselectedLabels: true,
        type: BottomNavigationBarType.fixed,
        backgroundColor: Color(0xff5ab031),
        iconSize: 30,
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.add_circle_outline),
            label: 'Sessions',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.library_books_outlined),
            label: 'Progress',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.perm_media),
            label: 'Records',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.perm_data_setting_outlined),
            label: 'Resources',
          ),
        ],
        selectedItemColor: Colors.black,
        unselectedItemColor: Colors.white,

      ),
    );
  }

/*
  final List<TitledNavigationBarItem> items = [
  TitledNavigationBarItem(title: Text('Home'), icon: Icons.home),
  TitledNavigationBarItem(title: Text('Create Session'), icon: Icons.add_circle_outline ),
  TitledNavigationBarItem(title: Text('Monthly Progress'), icon: Icons.library_books_outlined),
  TitledNavigationBarItem(title: Text('Records'), icon: Icons.perm_media),
  TitledNavigationBarItem(title: Text('Resources'), icon: Icons.perm_data_setting_outlined),
  ];

  bool navBarMode = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _children[_currentIndex],
      bottomNavigationBar: TitledBottomNavigationBar(
        onTap: onTappedBar,
        currentIndex: _currentIndex,
        reverse: navBarMode,
        curve: Curves.easeInBack,
        items: items,
        activeColor: const Color(0xff5ab031),
        inactiveColor: Colors.blueGrey,
      ),
    );
  }
*/


}