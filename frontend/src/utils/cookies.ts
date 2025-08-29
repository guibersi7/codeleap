// Utilitário para gerenciar cookies no lado cliente

interface CookieOptions {
  expires?: Date;
  maxAge?: number;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
}

// Função para definir um cookie
export function setCookie(
  name: string,
  value: string,
  options: CookieOptions = {}
): void {
  if (typeof window === "undefined") return;

  const {
    expires,
    maxAge,
    path = "/",
    domain,
    secure = process.env.NODE_ENV === "production",
    sameSite = "strict",
  } = options;

  let cookieString = `${name}=${encodeURIComponent(value)}`;

  if (expires) {
    cookieString += `; expires=${expires.toUTCString()}`;
  }

  if (maxAge) {
    cookieString += `; max-age=${maxAge}`;
  }

  if (path) {
    cookieString += `; path=${path}`;
  }

  if (domain) {
    cookieString += `; domain=${domain}`;
  }

  if (secure) {
    cookieString += `; secure`;
  }

  if (sameSite) {
    cookieString += `; samesite=${sameSite}`;
  }

  document.cookie = cookieString;
}

// Função para obter um cookie
export function getCookie(name: string): string | null {
  if (typeof window === "undefined") return null;

  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split("=");
    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null;
}

// Função para remover um cookie
export function removeCookie(name: string, path: string = "/"): void {
  if (typeof window === "undefined") return;

  // Definir o cookie com data de expiração no passado
  setCookie(name, "", {
    expires: new Date(0),
    path,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
}

// Função para verificar se um cookie existe
export function hasCookie(name: string): boolean {
  return getCookie(name) !== null;
}

// Função para obter todos os cookies como objeto
export function getAllCookies(): Record<string, string> {
  if (typeof window === "undefined") return {};

  const cookies: Record<string, string> = {};
  const cookieString = document.cookie;

  if (cookieString) {
    cookieString.split(";").forEach((cookie) => {
      const [name, value] = cookie.trim().split("=");
      if (name && value) {
        cookies[name] = decodeURIComponent(value);
      }
    });
  }

  return cookies;
}
