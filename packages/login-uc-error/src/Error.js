"use strict";

import ExtendableError from "es6-error";

export default class LoginUCError extends ExtendableError {
  constructor(message = "Unspecified Login-UC Error", data = null) {
    super(message);
    this.data = data;
    this.isLoginUCError = true;
  }
}
