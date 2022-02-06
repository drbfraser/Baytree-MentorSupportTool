// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";

type ErrorResponse = {
  error: string;
};

type SuccessResponse = {
  success: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ErrorResponse | SuccessResponse>
) {
  if (req.method === "POST") {
    const cookies = cookie.parse(req.headers.cookie ?? "");
    const access = cookies.access ?? false;

    if (!access) {
      return res.status(401).json({
        error: "User is not authenticated.",
      });
    }

    try {
      const apiRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/token/verify/`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: cookies.access }),
        }
      );

      if (apiRes.status !== 200) {
        res.setHeader("Set-Cookie", [
          cookie.serialize("access", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            expires: new Date(0), // Invalidate cookie
            sameSite: "strict",
            path: "/",
          }),
          cookie.serialize("refresh", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            expires: new Date(0), // Invalidate Cookie
            sameSite: "strict",
            path: "/",
          }),
        ]);

        return res.status(401).json({
          error: "User is not authenticated.",
        });
      } else {
        return res.status(200).json({ success: "User is authenticated." });
      }
    } catch (err) {
      return res.status(500).json({
        error: "Something went wrong when verifying user.",
      });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
