import { describe, beforeAll, test, expect } from "vitest";
import { createBiedronkaClient } from "../client";
import { setupTestClient } from "./helpers/setupTestClient";
import { invariant } from "../utils/invariant";
import { DashboardType } from "../schemas/dashboardDashboards";

describe("Promos", () => {
  let client: ReturnType<typeof createBiedronkaClient>;

  beforeAll(() => {
    client = setupTestClient();
  });

  test("carousels details", async () => {
    const dashboard = await client.dashboards.dashboard();

    expect(dashboard.ok).toBe(true);
    invariant(dashboard.ok, "Dashboard response is not ok");

    const carousel = dashboard.data.find(
      (item) => item.type === DashboardType.Carousels
    );

    expect(carousel).toBeDefined();
    invariant(carousel, "Carousel is not defined");
    invariant(carousel.param, "Carousel id is not defined");

    const response = await client.promos.carousels.details(carousel.param);

    expect(response.ok).toBe(true);
    invariant(response.ok);

    expect(response.data).toBeDefined();
  });
});
