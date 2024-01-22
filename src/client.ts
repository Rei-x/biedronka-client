import { z } from "zod";
import { refreshAccessToken } from "./refreshAcessToken";
import { transactionList } from "./schemas/transactionList";
import { transactionDetails } from "./schemas/transactionDetails";
import { jwtDecode } from "jwt-decode";
import { healthcheck } from "./schemas/healthcheck";
import { usersMe } from "./schemas/usersMe";
import { productsSearchByEAN } from "./schemas/productsSearchByEAN";
import { productsSearch } from "./schemas/productsSearch";
import { productsMostPurchased } from "./schemas/productsMostPurchased";
import { storeList } from "./schemas/storeList";
import { storeDetails } from "./schemas/storeDetails";
import { dashboardDashboards } from "./schemas/dashboardDashboards";
import { promosCarouselsDetails } from "./schemas/promosCarouselsDetails";
import { leafletsList } from "./schemas/leafletsList";
import { productsStockList } from "./schemas/productsStockList";
import { productsStockDetails } from "./schemas/productsStockDetails";
import { loyaltyActions } from "./schemas/loyaltyActions";
import { storiesList } from "./schemas/storiesList";
import { offersRevealAndActivate } from "./schemas/offersRevealAndActivate";
import { notificationsList } from "./schemas/notificationsList";
import { paymentOneClickBlikActivate } from "./schemas/paymentOneClickBlikActivate";
import { paymentOneClickBlikStatus } from "./schemas/paymentOneClickBlikStatus";
import { paymentOneClickBlikDeactivate } from "./schemas/paymentOneClickBlikDeactivate";

const url = "https://api.prod.biedronka.cloud";

/**
 * Creates a Biedronka client with the provided configuration.
 * @param refreshToken - The refresh token used for authentication.
 * @param accessToken - The access token used for authentication.
 * @param onRefresh - Optional callback function called when the access token is refreshed.
 * @param validateResponses - Optional flag indicating whether to validate API responses against schemas.
 * @returns The Biedronka client object.
 */
export const createBiedronkaClient = ({
  refreshToken,
  accessToken,
  onRefresh,
  validateResponses = false,
  printZodErrors = false,
}: {
  refreshToken: string;
  accessToken: string;
  onRefresh?: (tokens: { access_token: string; refresh_token: string }) => void;
  validateResponses?: boolean;
  printZodErrors?: boolean;
}) => {
  let myAccessToken = accessToken;
  let myRefreshToken = refreshToken;

  const myFetchClient = async <T extends z.ZodSchema>({
    endpoint,
    schema,
    params,
    init,
  }: {
    endpoint: string;
    schema: T;
    params?: Record<string, string>;
    init?: RequestInit;
  }): Promise<
    | {
        status: number;
        ok: true;
        data: z.infer<T>;
      }
    | {
        status: number;
        ok: false;
        response: Response;
        zodError?: z.ZodError;
      }
  > => {
    if (Date.now() > jwtDecode<{ exp: number }>(myAccessToken).exp * 1000) {
      const { access_token, refresh_token } = await refreshAccessToken({
        refreshToken: myRefreshToken,
      });

      myAccessToken = access_token;
      myRefreshToken = refresh_token;

      onRefresh?.({ access_token, refresh_token });
    }

    const apiPrefix = "/api/v1/";
    const paramsString = new URLSearchParams(params).toString();

    let finalEndpoint = `${url}${apiPrefix}${endpoint}/`;
    if (paramsString) {
      finalEndpoint = `${finalEndpoint}?${paramsString}`;
    }

    const response = await fetch(finalEndpoint, {
      ...init,
      headers: {
        ...init?.headers,
        "User-Agent": "okhttp/4.12.0",
        Authorization: `Bearer ${myAccessToken}`,
        "Accept-Language": "en-GB",
        "Accept-Encoding": "gzip",
      },
    });

    if (!response.ok) {
      return {
        status: response.status,
        ok: false,
        response,
      };
    }

    const json = await response.json();

    if (!validateResponses) {
      return {
        status: response.status,
        ok: true,
        data: json,
      };
    }

    const parsed = schema.safeParse(json);

    if (!parsed.success) {
      if (printZodErrors) {
        console.error(JSON.stringify(parsed.error.format(), null, 2));

        const fs = await import("fs");

        if (!fs.existsSync("./errors")) {
          fs.mkdirSync("./errors");
        }

        fs.writeFileSync(
          `./errors/error-${endpoint.replace(/\//g, "_")}.json`,
          JSON.stringify(parsed.error.format(), null, 2)
        );
        fs.writeFileSync(
          `./errors/response-${endpoint.replace(/\//g, "_")}.json`,
          JSON.stringify(json, null, 2)
        );
      }

      return {
        status: response.status,
        ok: false,
        response,
        zodError: parsed.error,
      };
    }

    return {
      status: response.status,
      ok: true,
      data: parsed.data,
    };
  };

  return {
    healthcheck: async () => {
      const response = await myFetchClient({
        endpoint: "healthchecks/ping",
        schema: healthcheck,
      });

      return response;
    },
    loyaltyActions: async () => {
      const response = await myFetchClient({
        endpoint: "loyalty-actions",
        schema: loyaltyActions,
      });

      return response;
    },
    payment: {
      oneClickBlik: {
        status: async () => {
          const response = await myFetchClient({
            endpoint: "payment/one-click-blik/status",
            schema: paymentOneClickBlikStatus,
          });

          return response;
        },
        deactivate: async ({ time_stamp }: { time_stamp: Date }) => {
          const response = await myFetchClient({
            endpoint: "payment/one-click-blik/deactivate",
            schema: paymentOneClickBlikDeactivate,
            init: {
              method: "POST",
              body: JSON.stringify({
                time_stamp: time_stamp.toISOString(),
              }),
              headers: {
                "Content-Type": "application/json; charset=utf-8",
              },
            },
          });

          return response;
        },
        activate: async ({
          blik_code,
          time_stamp,
        }: {
          blik_code: string;
          time_stamp: Date;
        }) => {
          const response = await myFetchClient({
            endpoint: "payment/one-click-blik/activate",
            schema: paymentOneClickBlikActivate,
            init: {
              method: "POST",
              body: JSON.stringify({
                blik_code,
                time_stamp: time_stamp.toISOString(),
              }),
              headers: {
                "Content-Type": "application/json; charset=utf-8",
              },
            },
          });

          return response;
        },
      },
    },
    notifications: {
      list: async () => {
        const response = await myFetchClient({
          endpoint: "notifications",
          schema: notificationsList,
        });

        return response;
      },
    },
    stories: {
      list: async () => {
        const response = await myFetchClient({
          endpoint: "stories",
          schema: storiesList,
        });

        return response;
      },
    },
    users: {
      me: async () => {
        const response = await myFetchClient({
          endpoint: "users/me",
          schema: usersMe,
        });

        return response;
      },

      meUpdate: async ({
        tobacco_marketing_consent,
        phone_number_pos_authorization_consent,
        is_blik_payment_active,
      }: {
        tobacco_marketing_consent: boolean;
        phone_number_pos_authorization_consent: boolean;
        is_blik_payment_active: boolean;
      }) => {
        const response = await myFetchClient({
          endpoint: "users/me",
          schema: usersMe,
          init: {
            method: "PATCH",
            body: JSON.stringify({
              tobacco_marketing_consent,
              phone_number_pos_authorization_consent,
              is_blik_payment_active,
            }),
            headers: {
              "Content-Type": "application/json; charset=utf-8",
            },
          },
        });

        return response;
      },
    },
    dashboards: {
      dashboard: async () => {
        const response = await myFetchClient({
          endpoint: "dashboards/dashboard",
          schema: dashboardDashboards,
        });

        return response;
      },
    },
    promos: {
      carousels: {
        details: async (id: string) => {
          const response = await myFetchClient({
            endpoint: `promos/carousels/${id}`,
            schema: promosCarouselsDetails,
          });

          return response;
        },
      },
    },
    offers: {
      revealAndActivate: async (id: string) => {
        const response = await myFetchClient({
          endpoint: `offers/${id}/reveal-and-activate`,
          schema: offersRevealAndActivate,
          init: {
            method: "PATCH",
          },
        });

        return response;
      },
      checkActivation: async (id: string) => {
        const response = await myFetchClient({
          endpoint: `offers/${id}/check-activation`,
          schema: z.never(),
        });

        return response;
      },
    },
    leaflets: {
      list: async () => {
        const response = await myFetchClient({
          endpoint: "leaflets",
          schema: leafletsList,
        });

        return response;
      },
    },
    products: {
      search: async (query: string) => {
        const response = await myFetchClient({
          endpoint: `products/search/${query}`,
          schema: productsSearch,
        });

        return response;
      },
      stock: {
        list: async ({
          latitude,
          longitude,
          ean,
          user_store,
        }: {
          latitude: number;
          longitude: number;
          ean: string;
          user_store: string;
        }) => {
          const response = await myFetchClient({
            endpoint: "products/stock",
            schema: productsStockList,
            init: {
              method: "POST",
              body: JSON.stringify({
                latitude,
                longitude,
                ean,
                user_store,
              }),
              headers: {
                "Content-Type": "application/json; charset=utf-8",
              },
            },
          });

          return response;
        },
        details: async ({
          latitude,
          longitude,
          ean,
          user_store,
        }: {
          latitude: number;
          longitude: number;
          ean: string;
          user_store: string;
        }) => {
          const response = await myFetchClient({
            endpoint: `products/stock/${user_store}/${ean}`,
            schema: productsStockDetails,
            params: {
              user_latitude: latitude.toString(),
              user_longitude: longitude.toString(),
            },
          });

          return response;
        },
      },
      searchByEAN: async ({ ean, store }: { ean: string; store: string }) => {
        const response = await myFetchClient({
          endpoint: `products/price/${store}/${ean}`,
          schema: productsSearchByEAN,
        });

        return response;
      },
      mostPurchased: async () => {
        const response = await myFetchClient({
          endpoint: "products/most-purchased",
          schema: productsMostPurchased,
        });

        return response;
      },
    },
    store: {
      list: async ({
        lat,
        lon,
        limit = 10,
      }: {
        lat: number;
        lon: number;
        limit?: number;
      }) => {
        const response = await myFetchClient({
          endpoint: "store",
          schema: storeList,
          params: {
            lat: lat.toString(),
            lon: lon.toString(),
            limit: limit.toString(),
          },
        });

        return response;
      },
      details: async (id: string) => {
        const response = await myFetchClient({
          endpoint: `store/${id}`,
          schema: storeDetails,
        });

        return response;
      },
    },
    transactions: {
      list: async (options?: { page: number }) => {
        const response = await myFetchClient({
          endpoint: "transactions",
          schema: transactionList,
          params: {
            page: options?.page.toString() ?? "1",
          },
        });

        return response;
      },
      details: async (id: string) => {
        const response = await myFetchClient({
          endpoint: `transactions/${id}`,
          schema: transactionDetails,
        });

        return response;
      },
      listArchive: async (options?: { page: number }) => {
        const response = await myFetchClient({
          endpoint: "transactions/archived",
          schema: transactionList,
          params: {
            page: options?.page.toString() ?? "1",
          },
        });

        return response;
      },
    },
  };
};
