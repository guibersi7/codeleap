from django.http import HttpResponse
from django.utils.deprecation import MiddlewareMixin

class CORSMiddleware(MiddlewareMixin):
    """
    Middleware personalizado para lidar com CORS
    """
    
    def process_request(self, request):
        # Se for uma requisição OPTIONS, responder imediatamente
        if request.method == 'OPTIONS':
            response = HttpResponse()
            response['Access-Control-Allow-Origin'] = '*'
            response['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
            response['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With'
            response['Access-Control-Max-Age'] = '86400'
            return response
        return None
    
    def process_response(self, request, response):
        # Adicionar headers CORS para todas as respostas
        response['Access-Control-Allow-Origin'] = '*'
        response['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
        response['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With'
        return response
