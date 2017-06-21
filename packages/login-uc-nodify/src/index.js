"use strict";

import axiosCookieJarSupport from "@3846masa/axios-cookiejar-support";
import tough from "tough-cookie";

export default function nodify(instance) {
  axiosCookieJarSupport(instance.client);
  instance.cookieJar = new tough.CookieJar();
  instance.client.defaults.jar = instance.cookieJar;
  instance.client.defaults.withCredentials = true;

  return instance;
}
