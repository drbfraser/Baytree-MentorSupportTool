import 'package:flutter/material.dart';

class MentoringPage extends StatefulWidget {
  @override
  _MentoringPageState createState() => _MentoringPageState();
}

class _MentoringPageState extends State<MentoringPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Mentoring Page'),
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