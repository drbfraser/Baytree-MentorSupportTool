// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { API_URL } from "../../config/config";
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
    try {
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

      return res.status(200).json({ success: "Sucessfully logged out." });
    } catch (err) {
      return res.status(500).json({
        error: "Something went wrong when logging out.",
      });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
