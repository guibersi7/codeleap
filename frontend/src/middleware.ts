import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Função para verificar se o token é válido
async function verifyToken(token: string): Promise<boolean> {
  try {
    // Definir URL da API baseada no ambiente
    const API_BASE_URL =
      process.env.NODE_ENV === "development"
        ? "http://localhost:8000"
        : "https://codeleap-production.up.railway.app";

    const response = await fetch(`${API_BASE_URL}/auth/verify/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verificar se o usuário está tentando acessar o dashboard
  if (pathname.startsWith("/dashboard")) {
    // Verificar se há um token de acesso
    const accessToken = request.cookies.get("access_token")?.value;

    if (!accessToken) {
      // Se não há token, redirecionar para login
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Verificar se o token é válido
    const isTokenValid = await verifyToken(accessToken);

    if (!isTokenValid) {
      // Se o token não é válido, redirecionar para login
      // Limpar cookies inválidos
      const response = NextResponse.redirect(new URL("/", request.url));
      response.cookies.delete("access_token");
      response.cookies.delete("refresh_token");
      response.cookies.delete("codeleap_user");
      return response;
    }

    // Token válido, permitir acesso
    return NextResponse.next();
  }

  // Verificar se o usuário está tentando acessar a tela de boas-vindas
  if (pathname === "/welcome") {
    // Sempre permitir acesso à tela de boas-vindas
    return NextResponse.next();
  }

  // Para a rota raiz, redirecionar para welcome
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/welcome", request.url));
  }

  // Para todas as outras rotas, permitir acesso normal
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
