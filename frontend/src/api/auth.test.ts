import { login, logout } from './auth';
import { expect } from '@jest/globals';
var axios = require("axios");
var MockAdapter = require("axios-mock-adapter");

var mock = new MockAdapter(axios);

describe("authentication", () => {

  /*it("login", async () => {
    // mock
    mock.onGet(`/login`, { testEmail: 'testEmail', password: 'testPassword' }).reply(200, { data: { email: testEmail, password: "John" }, error: "" });
    // when
    const result = await axios.get("/login")
    // then
    expect(mock.history.get[0].url).toEqual('/login');
  });*/

  it("logout", async () => {
    // mock
    mock.onGet(`/logout`).reply(200);
    // when
    const result = await axios.get("/logout")
    // then
    expect(mock.history.get[0].url).toEqual('/logout');
  });
});

