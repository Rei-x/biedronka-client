import { describe, beforeAll, test, expect } from "vitest";
import { createBiedronkaClient } from "../client";
import { setupTestClient } from "./helpers/setupTestClient";
import { invariant } from "../utils/invariant";

describe("Users", () => {
  let client: ReturnType<typeof createBiedronkaClient>;

  beforeAll(() => {
    client = setupTestClient();
  });

  test("me", async () => {
    const response = await client.users.me();

    expect(response.ok).toBe(true);
    invariant(response.ok);

    expect(response.data).toBeDefined();
  });

  test("meUpdate", async () => {
    const meData = await client.users.me();
    invariant(meData.ok);

    const response = await client.users.meUpdate({
      is_blik_payment_active: meData.data.is_blik_payment_active,
      phone_number_pos_authorization_consent:
        meData.data.consents.phone_number_pos_authorization_consent ?? true,
      tobacco_marketing_consent:
        meData.data.consents.tobacco_marketing_consent ?? false,
    });

    expect(response.ok).toBe(true);
    invariant(response.ok);

    expect(response.data).toBeDefined();
  });
});
