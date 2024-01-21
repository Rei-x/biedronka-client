/**
 * Refreshes the access token using the provided refresh token.
 * @param refreshToken The refresh token used to obtain a new access token.
 * @returns An object containing the new access token and related information.
 */
export const refreshAccessToken = async ({
  refreshToken,
}: {
  refreshToken: string;
}) => {
  const params = new URLSearchParams();
  params.append("grant_type", "refresh_token");
  params.append("refresh_token", refreshToken);
  params.append("token_type", "Bearer");
  params.append("redirect_uri", "app://cma20.biedronka.pl");
  params.append("client_id", "cma20");
  params.append("scope", "email profile forcom-loyalty");

  const data = await fetch(
    "https://konto.biedronka.pl/realms/loyalty/protocol/openid-connect/token",
    {
      method: "POST",
      body: params.toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return (await data.json()) as {
    access_token: string;
    expires_in: number;
    refresh_expires_in: number;
    refresh_token: string;
    token_type: string;
    "not-before-policy": number;
    session_state: string;
    scope: string;
  };
};
