import type { Participant, User } from "../../api/views";

// Fake data retrieved from https://datafakegenerator.com/generador.php
export const mentors: User[] = [
  {
    firstname: "Mike",
    surname: "Mulligan",
    dateOfBirth: "1992-07-02",
    email: "dumulligan20@yopmail.com",
    viewsPersonId: 1,
  },
  {
    firstname: "Daisy",
    surname: "Darrah",
    dateOfBirth: "1995-11-25",
    email: "cadarrah0@yopmail.com",
    viewsPersonId: 2
  }
];

export const mentees: Participant[] = [
  {
    firstName: "Inés",
    lastName: "Portaña",
    dateOfBirth: "1972-08-27",
    email: "jtportana19@yopmail.com",
    ethnicity: "",
    country: "Ecuador",
    viewsPersonId: 3,

  },
  {
    firstName: "Nancy",
    lastName: "Iturain",
    dateOfBirth: "1970-11-06",
    email: "esiturain18@yopmail.com",
    ethnicity: "",
    country: "Peru",
    viewsPersonId: 4,
  },
  {
    firstName: "Anali",
    lastName: "Garros",
    dateOfBirth: "1981-08-02",
    email: "aqgarros16@yopmail.com",
    ethnicity: "",
    country: "Haiti",
    viewsPersonId: 5,
  }
];
