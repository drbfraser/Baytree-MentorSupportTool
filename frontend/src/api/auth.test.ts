import axios from "axios";
import { login } from './auth';

jest.mock("axios");

describe("fetchUsers", () => {
    describe("when API call is successful", () => {
      it("should return users list", () => {
        // ...
      });
    })

    describe("when API call fails", () => {
      it("should return empty users list", () => {
        // ...
      });
    });
  });