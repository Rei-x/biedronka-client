import { login } from "../getAccessToken";
import { invariant } from "../utils/invariant";
import "dotenv/config";

const test = async () => {
  invariant(
    process.env.VITE_PHONE_NUMBER,
    "You need to provide a phone number to run the tests."
  );
  const result = await login({
    phoneNumber: process.env.VITE_PHONE_NUMBER,
    headless: false,
  });

  if (!result.expires_in) {
    console.error("Bad response");
  } else {
    console.log("Access token:", result.access_token);
    console.log("Refresh token:", result.refresh_token);
    console.log("Expires in:", result.expires_in);
  }
};

void test();
