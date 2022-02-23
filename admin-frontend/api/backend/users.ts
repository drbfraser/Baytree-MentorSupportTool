/*
  Endpoints for creating/reading/updating/deleting Django user(s).
  All users are a sub-type of a user in Django. For instance, Mentor users,
  Mentee users, Admin users, and Super users are all extensions of a Django user
  (think sub-classes in inheritance). To create any type of user, a User object
  must first be created, then a Mentor User must be created and linked to the
  User object that was first created.
*/

import { generateBackendCrudFuncs } from "./utils";

export interface UserCreate {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
}

export interface UserResponse {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export type UserUpdate = Partial<UserCreate> & { id: number };

export const usersBackendEndpoint = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/users/`;

export const {
  create: addUsers,
  read: getUsers,
  update: updateUsers,
  delete: deleteUsers,
} = generateBackendCrudFuncs<UserCreate, UserResponse, UserUpdate>(
  usersBackendEndpoint
);
