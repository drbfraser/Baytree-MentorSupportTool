
library mobile.global_variables;

int mentorID = 0;
int currentMenteeID = 0;

String host = "http://192.168.4.249:8000";

List<String> menteeList = [" "]; // Assign mentees in the home page
List<int> menteeIdList = [];


class Record {
  String status;
  Data data;

  Record({
    required this.status,
    required this.data,
  });

  factory Record.fromJson(Map<String, dynamic> json) => Record(
    status: json["status"],
    data: Data.fromJson(json["data"]),
  );

  Map<String, dynamic> toJson() => {
    "status": status,
    "data": data.toJson(),
  };
}


class Data {
  String status;
  List<MenteeUser> menteeUser;

  Data({
    required this.menteeUser,
    required this.status,
  });

  factory Data.fromJson(Map<String, dynamic> json) => Data(
    status: json["status"],
    menteeUser:
    List<MenteeUser>.from(json["menteeuser"].map((x) => MenteeUser.fromJson(x))),
  );

  Map<String, dynamic> toJson() => {
    "status": status,
    "menteeuser": List<dynamic>.from(menteeUser.map((x) => x.toJson())),

  };
}


class MenteeUser  {
  int mentorId;
  User user;

  MenteeUser({
    required this.mentorId,
    required this.user,
  });

  factory MenteeUser.fromJson(Map<String, dynamic> json) => MenteeUser(
    mentorId: json["mentorid"],
    user: User.fromJson(json["user"]),
  );

  Map<String, dynamic> toJson() => {
    "mentorid": mentorId,
    "user": user.toJson(),
  };
}


class User {
  int id;
  String email;
  String firstName;
  String lastName;

  User({
    required this.id,
    required this.email,
    required this.firstName,
    required this.lastName,
  });

  factory User.fromJson(Map<String, dynamic> json) => User(
    id: json["id"],
    email: json["email"],
    firstName: json["first_name"],
    lastName: json["last_name"],
  );

  Map<String, dynamic> toJson() => {
    "id": id,
    "email": email,
    "first_name": firstName,
    "last_name": lastName,
  };
}
