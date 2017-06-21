# Login UC - Siding

## Getting started

Install this module with:

```sh
yarn add lodash axios login-uc-siding
```

### Usage

```js
import Siding from "login-uc-siding";

async function main() {
  const siding = new Siding({
    username: "username",
    password: "badpassword",
  });

  await instance.login();
  const axios = instance.client;
  const { data } = await axios.get("/siding/dirdes/ingcursos/cursos/vista.phtml");
  // ...
}

main().catch(err => {
  if (err.isLoginUCError) {
    // Handle error
    console.log(err.message, err.data);
  } else {
    // Unknown error
    throw err;
  }
});
```
