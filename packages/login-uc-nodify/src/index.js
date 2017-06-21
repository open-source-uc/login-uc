"use strict";

import axiosCookieJarSupport from "@3846masa/axios-cookiejar-support";

export default function nodify(instance, cookieJar) {
  axiosCookieJarSupport(instance.client);
  instance.cookieJar = cookieJar;
  instance.client.defaults.jar = instance.cookieJar;
  instance.client.defaults.withCredentials = true;

  return instance;
}
