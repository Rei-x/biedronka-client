import type { LaunchOptions } from "playwright";
import readline from "readline-sync";

export class SmsTimeoutError extends Error {
  constructor(public until: Date) {
    super("SMS sending blocked");
  }
}
/**
 * Generates access token and refresh token for Biedronka using playwright
 */
/**
 * Logs in to the Biedronka website and retrieves the access token.
 *
 * @param phoneNumber - The phone number associated with the account.
 * @param getSmsCode - An optional function that retrieves the SMS code for verification. Defaults to prompting the user for input.
 * @param headless - Whether to run the browser in headless mode. Defaults to true.
 * @returns A promise that resolves to the authentication response, including the access token.
 * @throws {SmsTimeoutError} If sending verification codes has been blocked and there is a timeout until the next code can be requested.
 */
export const login = async ({
  phoneNumber,
  getSmsCode = async () => {
    return readline.question("SMS Code: ");
  },
  headless = true,
  launchOptions,
}: {
  phoneNumber: string;
  getSmsCode?: () => Promise<string>;
  headless?: boolean;
  launchOptions?: LaunchOptions;
}) => {
  const { chromium } = await import("playwright-extra");
  const { default: stealth } = await import("puppeteer-extra-plugin-stealth");

  chromium.use(stealth());

  const browser = await chromium.launch({
    headless,
    ...launchOptions,
  });

  const context = await browser.newContext({
    viewport: {
      width: 1920,
      height: 1080,
    },
    locale: "en-GB",
  });

  const page = await context.newPage();

  const redirectLocation = new Promise<string>((res) => {
    page.on("response", (response) => {
      if (response.status() === 302) {
        res(response.headers().location);
      }
    });
  });

  await page.goto(
    "https://konto.biedronka.pl/realms/loyalty/protocol/openid-connect/auth?response_type=code&client_id=cma20&redirect_uri=app%3A%2F%2Fcma20.biedronka.pl"
  );
  await page.getByRole("button", { name: /Accept/i }).click();
  await page.getByLabel(/Phone number/i).fill(phoneNumber);
  await page.getByLabel(/Phone number/i).clear();
  await page.getByLabel(/Phone number/i).fill(phoneNumber);
  await page.getByRole("button", { name: "Next" }).click();

  if ((await page.locator("text=Our systems has detected").count()) > 0) {
    throw new Error("Our systems has detected");
  }

  const after = new Date();
  await page.getByLabel(/SMS Code/i).click();

  if (
    (await page
      .locator("text=Sending verification codes has been blocked")
      .count()) > 0
  ) {
    const timeout = page
      .locator("text=Sending verification codes has been blocked")
      .first();

    const timeoutText = await timeout.innerText();

    const until = timeoutText.split("until")[1].trim();

    after.setFullYear(Number(until.split("-")[0]));
    after.setMonth(Number(until.split("-")[1]));
    after.setDate(Number(until.split("-")[2].split(" ")[0]));
    after.setHours(Number(until.split(" ")[1].split(":")[0]));
    after.setMinutes(Number(until.split(" ")[1].split(":")[1]));
    after.setSeconds(Number(until.split(" ")[1].split(":")[2]));

    throw new SmsTimeoutError(after);
  }
  const pinCode = await getSmsCode();

  await page.getByLabel(/SMS Code/i).fill(pinCode);
  await page.getByRole("button", { name: "Sign In" }).click();

  const redirect = await redirectLocation;

  const paramsFromRedirect = new URLSearchParams(redirect.split("?")[1]);

  const authParams = new URLSearchParams();

  authParams.append("grant_type", "authorization_code");
  authParams.append("client_id", "cma20");
  authParams.append("redirect_uri", "app://cma20.biedronka.pl");
  authParams.append("code", paramsFromRedirect.get("code") as string);
  authParams.append("code_verifier", "");
  authParams.append("code_challenge_method", "S256");

  const auth = await fetch(
    "https://konto.biedronka.pl/realms/loyalty/protocol/openid-connect/token",
    {
      method: "POST",
      body: authParams.toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  const authResponse = (await auth.json()) as {
    access_token: string;
    expires_in: number;
    refresh_expires_in: number;
    refresh_token: string;
    token_type: string;
    "not-before-policy": number;
    session_state: string;
    scope: string;
  };

  await context.close();
  await browser.close();

  return authResponse;
};
