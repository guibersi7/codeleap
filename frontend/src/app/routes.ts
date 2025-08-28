export const ROUTES = {
  HOME: "/",
  WELCOME: "/welcome",
  DASHBOARD: "/dashboard",
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RouteValue = (typeof ROUTES)[RouteKey];
