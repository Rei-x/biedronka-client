import { describe, beforeAll, test, expect } from "vitest";
import { createBiedronkaClient } from "../client";
import { setupTestClient } from "./helpers/setupTestClient";
import { invariant } from "../utils/invariant";
import readlineSync from "readline-sync";

describe("Payment", () => {
  let client: ReturnType<typeof createBiedronkaClient>;

  beforeAll(() => {
    client = setupTestClient();
  });

  test("status", async () => {
    const response = await client.payment.oneClickBlik.status();

    expect(response.ok).toBe(true);
    invariant(response.ok);

    expect(response.data).toBeDefined();
  });

  test.skip("deactivate", async () => {
    const response = await client.payment.oneClickBlik.deactivate({
      time_stamp: new Date(),
    });

    expect(response.ok).toBe(true);
    invariant(response.ok);

    expect(response.data).toBeDefined();
  });

  test.skip("activate", async () => {
    const response = await client.payment.oneClickBlik.activate({
      blik_code: readlineSync.question("Blik code: "),
      time_stamp: new Date(),
    });

    expect(response.ok).toBe(true);
    invariant(response.ok);

    expect(response.data).toBeDefined();
  });
});
