<p align="center">
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/BIEDRONA.JPG/240px-BIEDRONA.JPG" alt="Zdjęcie biedronki" />
  <h1 align="center">🐞 Biedronka Client 🐞</h1>
</p>


This project is not affiliated with or endorsed by Biedronka.

Reverse engineered client for mobile Biedronka app.

```sh
npm install biedronka-client
```

If you also want to login, you need to install `playwright` browser:

```sh
npx playwright install chromium
```

## Rate limits

Login is rate limited to 10 request per number (I don't think there is any time limit). If you exceed this limit, you will have to wait 30 minutes since the last try.

## Basic example

```typescript
import { createBiedronkaClient, login } from "biedronka-client";

const main = async () => {
  const credentials = await login({
    phoneNumber: "Your phone number",
  });
  // You will be prompted for the SMS code in the console

  const client = createBiedronkaClient({
    accessToken: credentials.access_token,
    refreshToken: credentials.refresh_token,
    validateResponses: false,
  });

  const response = await client.users.me();

  // If something went wrong, response.ok will be false
  if (!response.ok) {
    throw new Error("Unexpected error");
  }

  console.log(JSON.stringify(response.data, null, 2));
};

void main();
```

## With access token saved in file

```typescript
import { createBiedronkaClient, login } from "./dist";
import * as fs from "node:fs";

const main = async () => {
  // If you don't have token.json file, you need to login
  if (!fs.existsSync("./token.json")) {
    const { access_token, refresh_token } = await login({
      phoneNumber: "Your phone number",
    });

    const token = {
      access_token,
      refresh_token,
    };

    // Save tokens to token.json for later use
    fs.writeFileSync("./token.json", JSON.stringify(token));
  }

  // Read tokens from token.json
  const { access_token, refresh_token } = JSON.parse(
    fs.readFileSync("./token.json", "utf-8")
  );

  const client = createBiedronkaClient({
    accessToken: access_token,
    refreshToken: refresh_token,
    // Save new tokens when they are refreshed (optional)
    onRefresh: (tokens) => {
      fs.writeFileSync("./token.json", JSON.stringify(tokens));
    },
  });

  const response = await client.users.me();

  // If something went wrong, response.ok will be false
  if (!response.ok) {
    throw new Error("Unexpected error");
  }

  console.log(JSON.stringify(response.data, null, 2));
};

void main();
```
