#!/bin/bash

echo "🚀 Iniciando build do Django..."

# Instalar dependências
pip install -r requirements.txt

# Coletar arquivos estáticos
python manage.py collectstatic --noinput

# Executar migrações
python manage.py migrate

echo "✅ Build concluído!"
