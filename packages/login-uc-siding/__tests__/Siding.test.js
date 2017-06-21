"use strict";

import Siding from "../src/Siding";
import LoginUCError from "login-uc-error";
import nodify from "login-uc-nodify";

describe("Siding", () => {
  it("fails with login-uc-error", async () => {
    const instance = new Siding({
      username: "username",
      password: "badpassword",
    });
    nodify(instance);

    expect(instance).toBeTruthy();

    try {
      await instance.login();
      expect(false).toBeTruthy(); // fail test
    } catch (err) {
      expect(err).toBeInstanceOf(LoginUCError);
      expect(err.isLoginUCError).toBeTruthy();
    }
  });

  it.skip("logins with valid credentials", async () => {
    const instance = new Siding({
      username: "pelopez2",
      password: "PASSWORD",
    });
    nodify(instance);

    expect(instance).toBeTruthy();

    // TODO: better assertion
    await instance.login();
  });
});
