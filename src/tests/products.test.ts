import { beforeAll, describe, test, expect } from "vitest";
import { createBiedronkaClient } from "../client";
import { invariant } from "../utils/invariant";
import { CONSTANTS } from "./helpers/constants";
import { setupTestClient } from "./helpers/setupTestClient";

describe("Products", () => {
  let client: ReturnType<typeof createBiedronkaClient>;

  beforeAll(() => {
    client = setupTestClient();
  });

  test("search", async () => {
    const response = await client.products.search("chleb tostowy");

    expect(response.ok).toBe(true);
    invariant(response.ok);

    expect(response.data.length).toBeGreaterThan(0);
  });

  test("mostPurchased", async () => {
    const response = await client.products.mostPurchased();

    expect(response.ok).toBe(true);
    invariant(response.ok);

    expect(response.data.length).toBeGreaterThan(0);
  });

  test("searchByEAN", async () => {
    const response = await client.products.searchByEAN({
      ean: CONSTANTS.ean,
      store: CONSTANTS.storeId,
    });

    expect(response.ok).toBe(true);
    invariant(response.ok);

    expect(response.data).toBeDefined();
  });

  test("stockList", async () => {
    const response = await client.products.stock.list({
      user_store: CONSTANTS.storeId,
      ean: CONSTANTS.ean,
      latitude: CONSTANTS.latitude,
      longitude: CONSTANTS.longitude,
    });
    if (!response.ok) {
      console.log(response.response);
    }
    expect(response.ok).toBe(true);
    invariant(response.ok);

    expect(response.data).toBeDefined();
  });

  test("stockDetails", async () => {
    const response = await client.products.stock.details({
      user_store: CONSTANTS.storeId,
      ean: CONSTANTS.ean,
      latitude: CONSTANTS.latitude,
      longitude: CONSTANTS.longitude,
    });

    expect(response.ok).toBe(true);
    invariant(response.ok);

    expect(response.data).toBeDefined();
  });
});
