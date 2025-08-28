import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Verificar se o usuário está tentando acessar o dashboard
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    // Em uma implementação real, você verificaria se há um token de autenticação
    // Por enquanto, permitimos acesso direto, mas o frontend fará a verificação
    return NextResponse.next();
  }

  // Verificar se o usuário está tentando acessar a tela de boas-vindas
  if (request.nextUrl.pathname === "/welcome") {
    // Sempre permitir acesso à tela de boas-vindas
    return NextResponse.next();
  }

  // Para outras rotas, redirecionar para welcome
  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/welcome", request.url));
  }

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
