import 'package:flutter/material.dart';

class ResourcesPage extends StatefulWidget {
  @override
  _ResourcesPageState createState() => _ResourcesPageState();
}

class _ResourcesPageState extends State<ResourcesPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Resources Page'),
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