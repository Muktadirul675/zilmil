# backend/asgi.py
import os
import django
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

# â Must come first â before importing any Django app code
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

# â Now safe to import your routing modules
import products.routing
import orders.routing
import activities.routing
import authapp.routing
from middlewares.jwt_auth import JWTAuthMiddleware

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": JWTAuthMiddleware(
        URLRouter(
            products.routing.websocket_urlpatterns +
            orders.routing.websocket_urlpatterns +
            activities.routing.websocket_urlpatterns +
            authapp.routing.websocket_urlpatterns
        )
    )
})