from pathao_api import PathaoApi
from django.conf import settings

def get_pathao_client():
    return PathaoApi(
        client_id=settings.PATHAO_CLIENT_ID,
        client_secret=settings.PATHAO_CLIENT_SECRET,
        username=settings.PATHAO_USERNAME,
        password=settings.PATHAO_PASSWORD,
        base_url=getattr(settings, "PATHAO_BASE_URL")
    )