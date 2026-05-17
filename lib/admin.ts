import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "nb_admin";

export function adminToken() {
  const password = process.env.ADMIN_PASSWORD ?? "";
  return crypto.createHash("sha256").update(`netherlandsbest:${password}`).digest("hex");
}

export function isAdminAuthenticated() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  return cookies().get(COOKIE_NAME)?.value === adminToken();
}

export function adminCookie() {
  return { name: COOKIE_NAME, value: adminToken() };
}
