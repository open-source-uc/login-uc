"use strict";

import { resolve } from "url";
import { request, form, createTransport } from "popsicle";
import LoginUCError from "login-uc-error";

export default class Siding {
  constructor(credentials = {}, options = {}) {
    if (!credentials.username || !credentials.password) {
      throw new LoginUCError("Must set credentials on constructor");
    }

    this.urls = Object.assign({}, Siding.urls, options.urls);
    this.username = credentials.username.split("@")[0];
    this.password = credentials.password;

    this.timeout = options.timeout || 5000;
    this.headers = options.headers || {};
    this.jar = options.jar;
    this.transport = createTransport(
      Object.assign(
        {
          type: "text",
          unzip: true,
          // maxRedirects: 10,
          jar: this.jar,
          withCredentials: true,
          // rejectUnauthorized: false,
        },
        options.transport
      )
    );
  }

  cookies() {
    return new Promise((fulfill, reject) => {
      return this.jar.getCookies(Siding.urls.main, {}, (err, cookies) => {
        if (err) reject(err);
        else fulfill(cookies);
      });
    });
  }

  request(method, url, options = {}) {
    const defaults = {
      method,
      url,
      timeout: this.timeout,
      transport: this.transport,
      headers: this.headers,
    };
    return request(Object.assign(defaults, options));
  }

  get(url, options) {
    return this.request("GET", resolve(this.urls.base, url), options);
  }

  post(url, options) {
    return this.request("POST", resolve(this.urls.base, url), options);
  }

  verify() {
    return this.request("GET", this.urls.main).then(response => {
      // TODO: verify this is a valid check. Try with `response.headers`
      const isLogged = response.body.indexOf("passwd") === -1;

      if (!isLogged) {
        throw new LoginUCError("Failed Siding verify", {
          username: this.username,
        });
      } else {
        return this;
      }
    });
  }

  login() {
    const body = form({
      login: this.username,
      passwd: this.password,
      sw: "",
      sh: "",
      cd: "",
    });
    return this.request("POST", this.urls.login, { body }).then(response => {
      const cookie = response.get("set-cookie"); // .replace("; path=/", "");
      const isValid = cookie && cookie.indexOf("SIDING_SESSID") > -1;

      if (!isValid) {
        throw new LoginUCError("Failed Siding login", {
          username: this.username,
        });
      } else {
        // this.headers["Cookie"] = cookie; // TODO: not needed?
        return this;
      }
    });
  }
}

Siding.urls = {
  domain: "intrawww.ing.puc.cl",
  base: "https://intrawww.ing.puc.cl",
  main: "https://intrawww.ing.puc.cl/siding",
  login: "https://intrawww.ing.puc.cl/siding/index.phtml",
};
