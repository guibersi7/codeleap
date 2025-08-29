import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Função para obter a URL base da API baseada no ambiente
export function getApiBaseUrl(): string {
  // Se estiver em desenvolvimento, usar localhost
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:8000';
  }
  
  // Em produção, usar Railway
  return 'https://codeleap-production.up.railway.app';
}

// Função para obter a URL completa de uma imagem
export function getImageUrl(imagePath: string | null): string | null {
  if (!imagePath) return null;
  
  // Se já é uma URL completa, retornar como está
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Se é um caminho relativo, adicionar a URL base
  const baseUrl = getApiBaseUrl();
  return `${baseUrl}${imagePath}`;
}
