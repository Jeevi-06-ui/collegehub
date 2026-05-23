import { isProduction } from "../config/env.js";

const cookieName = "collegehub_token";

export const sendTokenCookie = (res, token) => {
  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};

export const clearTokenCookie = (res) => {
  res.clearCookie(cookieName, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax"
  });
};

export const getCookieName = () => cookieName;
