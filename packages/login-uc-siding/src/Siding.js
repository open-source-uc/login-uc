"use strict";

import axios from "axios";
import qs from "qs";
import get from "lodash/get";

import LoginUCError from "login-uc-error";

export default class Siding {
  constructor(credentials = {}, options = {}) {
    if (!credentials.username || !credentials.password) {
      throw new LoginUCError("Must set credentials on constructor");
    }

    this.options = Object.assign(
      {
        timeout: 3000,
        baseURL: "https://intrawww.ing.puc.cl/",
        withCredentials: true,
      },
      options
    );
    this.username = credentials.username.split("@")[0];
    this.password = credentials.password;

    this.client = axios.create(this.options);
  }

  verify() {
    return this.client.get("/siding").then(({ data }) => {
      // TODO: verify this is a valid check
      // const isLogged = get(headers, "cache-control", null);
      const isLogged = data.indexOf("passwd") === -1;

      if (!isLogged) {
        throw new LoginUCError("Failed Siding login", {
          username: this.username,
        });
      } else {
        return this;
      }
    });
  }

  login() {
    const body = qs.stringify({
      login: this.username,
      passwd: this.password,
      sw: "",
      sh: "",
      cd: "",
    });

    return this.client
      .post("/siding/index.phtml", body)
      .then(({ headers }) => {
        const cookie = get(headers, ["set-cookie", 0], "").replace(
          "; path=/",
          ""
        );
        this.client.defaults.headers.common["Cookie"] = cookie;
        return this;
      })
      .then(() => this.verify());
  }
}
