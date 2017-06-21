"use strict";

import { jar } from "popsicle";
import { CookieJar } from "umd-tough-cookie";
import LoginUCError from "login-uc-error";

import Siding from "../src/Siding";

const createJar = env => {
  switch (env) {
    case "node":
      return jar();
    case "react-native":
      return new CookieJar();
    case "browser":
    default:
      return undefined;
  }
};

describe("Siding", () => {
  it("fails with login-uc-error", async () => {
    const instance = new Siding({
      username: "username",
      password: "badpassword",
    });

    expect(instance).toBeTruthy();

    try {
      await instance.login();
      await instance.verify();
      expect(false).toBeTruthy(); // fail test
    } catch (err) {
      expect(err).toBeInstanceOf(LoginUCError);
      expect(err.isLoginUCError).toBeTruthy();
    }
  });

  // TODO: add password and simulate enviorements
  describe.skip("cookie jars", () => {
    const valid = {
      username: "pelopez2",
      password: "",
    };

    it("logins in node", async () => {
      const instance = new Siding(valid, { jar: createJar("node") });
      expect(instance).toBeTruthy();

      await instance.login();
      await instance.verify();
      const cookies = await instance.cookies();
      expect(cookies).not.toHaveLength(0);
    });

    it("logins in browsers", async () => {
      const instance = new Siding(valid, { jar: createJar("browser") });
      expect(instance).toBeTruthy();

      // TODO
    });

    it("logins in react-native", async () => {
      const instance = new Siding(valid, { jar: createJar("react-native") });
      expect(instance).toBeTruthy();

      // TODO
    });
  });
});
