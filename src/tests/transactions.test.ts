import { beforeAll, describe, expect, test } from "vitest";
import { createBiedronkaClient } from "../client";
import { setupTestClient } from "./helpers/setupTestClient";
import { invariant } from "../utils/invariant";

describe("Transactions", () => {
  let client: ReturnType<typeof createBiedronkaClient>;

  beforeAll(() => {
    client = setupTestClient();
  });

  test("list", async () => {
    const response = await client.transactions.list({
      page: 1,
    });

    expect(response.ok).toBe(true);
    invariant(response.ok);
    expect(response.data).toBeDefined();
  });

  test("details", async () => {
    const listResponse = await client.transactions.list({
      page: 1,
    });

    expect(listResponse.ok).toBe(true);
    invariant(listResponse.ok);
    expect(listResponse.data).toBeDefined();

    const firstTransaction = listResponse.data.transactions.at(0);

    invariant(firstTransaction);

    const response = await client.transactions.details(firstTransaction.id);

    expect(response.ok).toBe(true);
    invariant(response.ok);
    expect(response.data).toBeDefined();
  });

  test("listArchive", async () => {
    const response = await client.transactions.listArchive({
      page: 1,
    });

    expect(response.ok).toBe(true);
    invariant(response.ok);
    expect(response.data).toBeDefined();
  });
});
