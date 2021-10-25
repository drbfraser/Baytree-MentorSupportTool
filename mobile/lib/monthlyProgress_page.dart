import 'package:flutter/material.dart';

class MonthlyProgressPage extends StatefulWidget {
  @override
  _MonthlyProgressPageState createState() => _MonthlyProgressPageState();
}

class _MonthlyProgressPageState extends State<MonthlyProgressPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Monthly Progress Page'),
        backgroundColor: const Color(0xff5ab031),
      ),
      body: Container(
        decoration: const BoxDecoration(
          color: Color(0xedffffff),
        ),
        child: ListView(
          children: <Widget>[
            Text('Your text goes here'),
          ],
        ),
      ),
    );
  }
}