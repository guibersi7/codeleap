#!/usr/bin/env python3
"""
Script para testar o endpoint de login
"""

import requests
import json
import sys

def test_login_endpoint():
    """Testa o endpoint de login"""
    
    # URL do endpoint
    url = "https://codeleap-production.up.railway.app/auth/login/"
    
    # Dados de teste
    test_data = {
        "username": "testuser123"
    }
    
    # Headers
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
    
    print(f"Testando endpoint: {url}")
    print(f"Dados enviados: {json.dumps(test_data, indent=2)}")
    print("-" * 50)
    
    try:
        # Fazer a requisição
        response = requests.post(url, json=test_data, headers=headers, timeout=30)
        
        print(f"Status Code: {response.status_code}")
        print(f"Headers: {dict(response.headers)}")
        print("-" * 50)
        
        # Tentar parsear a resposta JSON
        try:
            response_data = response.json()
            print(f"Resposta JSON: {json.dumps(response_data, indent=2)}")
        except json.JSONDecodeError:
            print(f"Resposta não é JSON válido: {response.text}")
        
        # Verificar se foi bem-sucedido
        if response.status_code == 200:
            print("✅ Login bem-sucedido!")
            return True
        elif response.status_code == 400:
            print("❌ Erro de validação (400)")
            return False
        elif response.status_code == 500:
            print("❌ Erro interno do servidor (500)")
            return False
        else:
            print(f"❌ Status code inesperado: {response.status_code}")
            return False
            
    except requests.exceptions.Timeout:
        print("❌ Timeout na requisição")
        return False
    except requests.exceptions.ConnectionError:
        print("❌ Erro de conexão")
        return False
    except Exception as e:
        print(f"❌ Erro inesperado: {str(e)}")
        return False

def test_health_check():
    """Testa se o servidor está respondendo"""
    
    url = "https://codeleap-production.up.railway.app/"
    
    print(f"Testando health check: {url}")
    print("-" * 50)
    
    try:
        response = requests.get(url, timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Servidor está respondendo: {'✅' if response.status_code < 500 else '❌'}")
        return response.status_code < 500
    except Exception as e:
        print(f"❌ Erro no health check: {str(e)}")
        return False

if __name__ == "__main__":
    print("🧪 Testando endpoints do backend")
    print("=" * 50)
    
    # Testar health check primeiro
    if test_health_check():
        print("\n" + "=" * 50)
        # Testar login
        test_login_endpoint()
    else:
        print("❌ Servidor não está respondendo")
        sys.exit(1)
