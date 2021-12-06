import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

class ResourcesPage extends StatefulWidget {
  @override
  _ResourcesPageState createState() => _ResourcesPageState();
}

class _ResourcesPageState extends State<ResourcesPage> {
  late WebViewController controller;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Resources Page'),
        centerTitle: true,
        actions: [
          IconButton(
            icon: Icon(Icons.arrow_back),
            onPressed: () async {
              if (await controller.canGoBack()) {
                controller.goBack();
              }
            },
          ),
          IconButton(
            icon: Icon(Icons.refresh),
            onPressed: () async {
                controller.reload();
            },
          )
        ],
        backgroundColor: const Color(0xff5ab031),
      ),
      body: WebView (
        javascriptMode: JavascriptMode.unrestricted,
          initialUrl: 'https://thebaytreecentre.sharepoint.com/:f:/g/Ej7DxK0KjzNBuTwQ_lU-0bMBdMNHOWzHi2bzGJB86G4Bjg',
          onWebViewCreated: (controller){
            this.controller = controller;
         //  controller.evaluateJavascript(
         //   "document.getElementsByTagName('')[0].style.display='none'"
         //   );
          },
      ),
    );
  }
}