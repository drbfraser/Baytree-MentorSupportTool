import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;
import 'package:http/http.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:form_field_validator/form_field_validator.dart';
import 'home_page.dart';
import 'main.dart';
import 'navigation_bar.dart';
import 'global_variables.dart' as global;

class LoginPage extends StatefulWidget {
  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  bool _isLoading = false;
  String error = "";

  GlobalKey<FormState> formkey = GlobalKey<FormState>();

  @override
  Widget build(BuildContext context) {
    SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle(
      statusBarColor: const Color(0xff5ab031),
      statusBarIconBrightness: Brightness.dark,
    ));
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          color: Color(0xedffffff),
        ),
        child: _isLoading
            ? Center(child: CircularProgressIndicator())
            : ListView(
                children: <Widget>[
                  headerImage(),
                  headerSection(),
                  userInput(),
                  resetPassword(),
                  errorMessasge(error),
                  loginButton(),
                ],
              ),
      ),
    );
  }

  register() async {
    Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute(
            builder: (BuildContext context) => MyBottomNavigationBar()),
        (Route<dynamic> route) => false);
  }

  signIn(String username, email, pass) async {
    SharedPreferences sharedPreferences = await SharedPreferences.getInstance();
    Map data = {'username': username, 'email': email, 'password': pass};
    var jsonResponse = null;
    var response = await http.post(
        Uri.parse(global.host + "/rest-auth/login/"),
        body: data);

    if (response.statusCode == 400) {
      error = "Invalid Credentials";

      setState(() {
        _isLoading = false;
      });
    } else if (response.statusCode == 200) {
      jsonResponse = json.decode(response.body);
      if (jsonResponse != null) {
        setState(() {
          _isLoading = false;
        });
        sharedPreferences.setString("token", jsonResponse['key']);

        // Get user ID
        String basicAuth = 'Basic ' + base64Encode(utf8.encode('$email:$pass'));
        global.basicAuth = basicAuth;
        Response r = await get(
            Uri.parse(global.host + '/rest-auth/user'),
            headers: <String, String>{'authorization': basicAuth});
        if (r.statusCode == 200 || r.statusCode == 201) {
          var decodedJson = jsonDecode(r.body);
          sharedPreferences.setInt("id", decodedJson['id']);
        }

        Navigator.of(context).pushAndRemoveUntil(
            MaterialPageRoute(
                builder: (BuildContext context) => MyBottomNavigationBar()),
            (Route<dynamic> route) => false);
      }
    } else {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Container headerSection() {
    return Container(
      margin: EdgeInsets.only(top: 0.0, bottom: 0),
      padding: EdgeInsets.symmetric(horizontal: 20.0, vertical: 30.0),
      child: Text("Mentor Portal",
          textAlign: TextAlign.center,
          style: TextStyle(
              color: Colors.black,
              fontSize: 24.0,
              fontWeight: FontWeight.bold)),
    );
  }

  Container headerImage() {
    return Container(
      child: Padding(
        padding: const EdgeInsets.only(top: 60.0, bottom: 0.0),
        child: Center(
          child: Container(
              width: 200,
              height: 150,
              child: Image.asset('assets/baytree-logo.png')),
        ),
      ),
    );
  }

  final TextEditingController emailController = new TextEditingController();
  final TextEditingController passwordController = new TextEditingController();

  Container userInput() {
    return Container(
      child: Form(
        autovalidateMode: AutovalidateMode.always,
        key: formkey,
        child: Column(
          children: <Widget>[
            Padding(
              padding: EdgeInsets.symmetric(horizontal: 15),
              child: TextFormField(
                  controller: emailController,
                  cursorColor: const Color(0xff5ab031),
                  style: TextStyle(color: const Color(0xff5ab031)),
                  decoration: InputDecoration(
                    icon: Icon(Icons.email, color: const Color(0xff5ab031)),
                    hintText: "Email",
                    border: UnderlineInputBorder(
                        borderSide: BorderSide(color: const Color(0xff5ab031))),
                    hintStyle: TextStyle(color: const Color(0xff319004)),
                  ),
                  validator: MultiValidator([
                    RequiredValidator(errorText: "* Required"),
                    EmailValidator(errorText: "Enter a Valid Email Address"),
                  ])),
            ),
            Padding(
              padding: const EdgeInsets.only(
                  left: 15.0, right: 15.0, top: 15, bottom: 0),
              child: TextFormField(
                  obscureText: true,
                  controller: passwordController,
                  cursorColor: const Color(0xff5ab031),
                  style: TextStyle(color: const Color(0xff5ab031)),
                  decoration: InputDecoration(
                    icon: Icon(Icons.lock, color: const Color(0xff5ab031)),
                    hintText: "Password",
                    border: UnderlineInputBorder(
                        borderSide: BorderSide(color: const Color(0xff5ab031))),
                    hintStyle: TextStyle(color: const Color(0xff319004)),
                  ),
                  validator: MultiValidator([
                    RequiredValidator(errorText: "* Required"),
                    MinLengthValidator(6,
                        errorText: "Password should be atleast 6 characters"),
                    MaxLengthValidator(15,
                        errorText:
                            "Password should not be greater than 15 characters")
                  ])
                  //validatePassword,        //Function to check validation
                  ),
            ),
          ],
        ),
      ),
    );
  }

  Container resetPassword() {
    return Container(
        child: FlatButton(
      onPressed: () {
        //TODO FORGOT PASSWORD PAGE
      },
      child: const Text(
        'Reset Password',
        style: TextStyle(color: const Color(0xfff61d81), fontSize: 17),
      ),
    ));
  }

  Container newAccount() {
    return Container(
        //TODO NEW ACCOUNT PAGE
        );
  }

  Container errorMessasge(String message) {
    return Container(
      child: Text(message,
          textAlign: TextAlign.center,
          style: TextStyle(
              color: const Color(0xffaf0202),
              fontSize: 20.0,
              fontWeight: FontWeight.bold)),
    );
  }

  Container loginButton() {
    return Container(
      width: MediaQuery.of(context).size.width,
      height: 50.0,
      padding: EdgeInsets.symmetric(horizontal: 15.0),
      margin: EdgeInsets.only(top: 15.0),
      child: RaisedButton(
        onPressed: () {
          if (formkey.currentState!.validate()) {
            signIn("", emailController.text, passwordController.text);
            //print("Validated");
          } else {
            //print("Not Validated");
          }
        },
        elevation: 0.0,
        color: const Color(0xff378e0c),
        child: Text(
          "Sign In",
          style: new TextStyle(
            fontSize: 20.0,
            color: Colors.white,
          ),
        ),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(5.0)),
      ),
    );
  }
}
