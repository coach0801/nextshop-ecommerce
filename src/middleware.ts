export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: ["/checkout/:path*", "/account/:path*", "/api/cart/:path*"],
};
