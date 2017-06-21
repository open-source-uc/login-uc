import axios from "axios";
import axiosCookieJarSupport from "@3846masa/axios-cookiejar-support";
import tough from "tough-cookie";
import qs from "qs";
import get from "lodash/get";

import LoginUCError from "login-uc-error";

export default class Siding {
  constructor(credentials = {}, options = {}) {
    if (!credentials.username || !credentials.password) {
      throw new LoginUCError("Must set credentials on constructor");
    }

    this.options = options;
    this.username = credentials.username.split("@")[0];
    this.password = credentials.password;

    this.cookieJar = new tough.CookieJar();
    this.client = axios.create({
      timeout: 3000,
      baseURL: "https://intrawww.ing.puc.cl/",
      withCredentials: true,
    });
    axiosCookieJarSupport(this.client);
    this.client.defaults.jar = this.cookieJar;
    this.client.defaults.withCredentials = true;
  }

  async verify() {
    const { headers } = await this.client.head("/siding");

    // TODO: verify this is a valid check
    const isLogged = get(headers, "cache-control", null);

    if (!isLogged) {
      throw new LoginUCError("Failed Siding login", {
        username: this.username,
      });
    } else {
      return true;
    }
  }

  async login() {
    const body = qs.stringify({
      login: this.username,
      passwd: this.password,
      sw: "",
      sh: "",
      cd: "",
    });

    const { headers } = await this.client.post("/siding/index.phtml", body);
    const cookie = get(headers, ["set-cookie", 0], "").replace("; path=/", "");
    this.client.defaults.headers.common["Cookie"] = cookie;

    return this.verify();
  }
}
