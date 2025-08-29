"use server";

import { cookies } from "next/headers";

// Server Action para debug de cookies
export async function debugCookiesAction() {
  try {
    const cookieStore = await cookies();

    // Tentar definir um cookie de teste
    cookieStore.set("debug_cookie", "test_value", {
      httpOnly: false, // Permitir acesso via JavaScript para debug
      secure: false, // Permitir HTTP para desenvolvimento
      sameSite: "lax",
      maxAge: 60 * 60, // 1 hora
    });

    // Ler todos os cookies
    const allCookies = cookieStore.getAll();

    return {
      success: true,
      message: "Cookie de debug definido",
      cookies: allCookies.map((cookie) => ({
        name: cookie.name,
        value: cookie.value,
      })),
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro desconhecido",
      cookies: [],
    };
  }
}

// Server Action para verificar cookies
export async function checkCookiesAction() {
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();

    return {
      success: true,
      cookies: allCookies.map((cookie) => ({
        name: cookie.name,
        value: cookie.value,
      })),
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro desconhecido",
      cookies: [],
    };
  }
}
