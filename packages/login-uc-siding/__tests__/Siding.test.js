import Siding from "../src/Siding";
import LoginUCError from "login-uc-error";

describe("Siding", () => {
  it("fails with login-uc-error", async () => {
    const instance = new Siding({
      username: "username", // without @uc.cl
      password: "badpassword",
    });
    expect(instance).toBeTruthy();

    try {
      await instance.login();
      expect(false).toBeTruthy(); // fail test
    } catch (err) {
      expect(err).toBeInstanceOf(LoginUCError);
      expect(err.isLoginUCError).toBeTruthy();
    }
  });
});
