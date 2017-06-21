# Login UC - Siding

## Getting started

Install this module with:

```sh
yarn add popsicle login-uc-siding
```

### Usage

```js
import Siding from "login-uc-siding";

async function main() {
  const siding = new Siding({
    username: "username",
    password: "password",
  });

  await instance.login();
  await instance.verify();
  const { body, headers } = await instance.get("/siding/dirdes/ingcursos/cursos/vista.phtml");
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
