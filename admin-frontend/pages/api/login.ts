// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";

type ErrorResponse = {
  error: string;
};

type SuccessResponse = {
  success: string;
};

interface APIResponse {
  access: string;
  refresh: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ErrorResponse | SuccessResponse>
) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    const body = JSON.stringify({
      email,
      password,
    });

    try {
      const apiRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/token/`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: body,
        }
      );

      const data = (await apiRes.json()) as APIResponse;

      res.setHeader("Set-Cookie", [
        cookie.serialize("access", data.access, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          maxAge: 60 * 30, // 30 Min access token expiry
          sameSite: "strict",
          path: "/",
        }),
        cookie.serialize("refresh", data.refresh, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          maxAge: 60 * 60 * 24, // 1 day refresh token expiry
          sameSite: "strict",
          path: "/",
        }),
      ]);

      if (apiRes.status === 200) {
        return res.status(200).json({ success: "Sucessfully logged in." });
      } else {
        return res.status(apiRes.status).json({
          error: "Failed to log in",
        });
      }
    } catch (err) {
      return res.status(500).json({
        error: "Something went wrong when logging in.",
      });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
