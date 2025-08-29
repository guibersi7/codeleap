import cloudinary.uploader
import cloudinary.api
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

def upload_image_to_cloudinary(image_file, folder="posts"):
    """
    Faz upload de uma imagem para o Cloudinary
    """
    try:
        # Upload da imagem para o Cloudinary
        result = cloudinary.uploader.upload(
            image_file,
            folder=folder,
            resource_type="image",
            transformation=[
                {"width": 800, "height": 600, "crop": "limit"},
                {"quality": "auto", "fetch_format": "auto"}
            ]
        )
        
        # Retorna a URL da imagem
        return result.get('secure_url')
    
    except Exception as e:
        logger.error(f"Erro ao fazer upload para Cloudinary: {str(e)}")
        raise Exception(f"Erro ao fazer upload da imagem: {str(e)}")

def delete_image_from_cloudinary(public_id):
    """
    Deleta uma imagem do Cloudinary
    """
    try:
        if public_id:
            cloudinary.uploader.destroy(public_id)
    except Exception as e:
        logger.error(f"Erro ao deletar imagem do Cloudinary: {str(e)}")
        # Não levanta exceção para não quebrar o fluxo principal
