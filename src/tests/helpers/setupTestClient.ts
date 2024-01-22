import { createBiedronkaClient } from "../../client";
import { invariant } from "../../utils/invariant";

export const setupTestClient = () => {
  invariant(
    process.env.VITE_ACCESS_TOKEN,
    "You need to provide an access token to run the tests."
  );
  invariant(
    process.env.VITE_REFRESH_TOKEN,
    "You need to provide a refresh token to run the tests."
  );

  return createBiedronkaClient({
    accessToken: process.env.VITE_ACCESS_TOKEN,
    refreshToken: process.env.VITE_REFRESH_TOKEN,
    validateResponses: true,
    printZodErrors: true,
  });
};
