import 'package:flutter/material.dart';
import 'package:baytree_mobile/navigation_bar.dart';
import 'dart:async';
import 'package:shared_preferences/shared_preferences.dart';

class MessagesPage extends StatefulWidget {
  @override
  _MessagesPageState createState() => _MessagesPageState();
}

Future<String?> getTokenPreference() async {
  SharedPreferences prefs = await SharedPreferences.getInstance();
  String? token = prefs.getString("token");
  return token;
}

class _MessagesPageState extends State<MessagesPage> {

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
      title: const Text('Notifications'),
      centerTitle: true,
      backgroundColor: const Color(0xff5ab031),
      automaticallyImplyLeading: false,
      leading: IconButton (
        iconSize: 32.0,
        icon: Icon(Icons.arrow_back_ios_outlined ),
        onPressed: () {
          Navigator.of(context).pushAndRemoveUntil(
              MaterialPageRoute(
                  builder: (BuildContext context) => MyBottomNavigationBar()),
                  (Route<dynamic> route) => false);
        },
      ),

    );

  }

}