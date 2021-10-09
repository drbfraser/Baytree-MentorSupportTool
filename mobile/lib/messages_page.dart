import 'package:flutter/material.dart';

class MessagesPage extends StatefulWidget {
  @override
  _MessagesPageState createState() => _MessagesPageState();
}

class _MessagesPageState extends State<MessagesPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Messages Page'),
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