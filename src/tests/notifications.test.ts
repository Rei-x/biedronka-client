import { describe, beforeAll, test, expect } from "vitest";
import { createBiedronkaClient } from "../client";
import { setupTestClient } from "./helpers/setupTestClient";
import { invariant } from "../utils/invariant";

describe("Notifications", () => {
  let client: ReturnType<typeof createBiedronkaClient>;

  beforeAll(() => {
    client = setupTestClient();
  });

  test("list", async () => {
    const response = await client.notifications.list();

    expect(response.ok).toBe(true);
    invariant(response.ok);

    expect(response.data).toBeDefined();
  });
});
