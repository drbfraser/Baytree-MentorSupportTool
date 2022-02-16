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
