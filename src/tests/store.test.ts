import { describe, beforeAll, test, expect } from "vitest";
import { createBiedronkaClient } from "../client";
import { setupTestClient } from "./helpers/setupTestClient";
import { invariant } from "../utils/invariant";
import { CONSTANTS } from "./helpers/constants";

describe("Stores", () => {
  let client: ReturnType<typeof createBiedronkaClient>;

  beforeAll(() => {
    client = setupTestClient();
  });

  test("list", async () => {
    const response = await client.store.list({
      lat: CONSTANTS.latitude,
      lon: CONSTANTS.longitude,
      limit: 10,
    });

    expect(response.ok).toBe(true);
    invariant(response.ok);

    expect(response.data).toBeDefined();
    expect(response.data.length).toBeGreaterThan(0);
  });

  test("details", async () => {
    const response = await client.store.details(CONSTANTS.storeId);

    expect(response.ok).toBe(true);
    invariant(response.ok);

    expect(response.data).toBeDefined();
  });
});
