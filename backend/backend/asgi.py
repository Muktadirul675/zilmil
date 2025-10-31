import os

# 1ï¸â£ Set the settings module first
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

# 2ï¸â£ Setup Django
import django
django.setup()

# 3ï¸â£ Now import everything else safely
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from middlewares.jwt_auth import JWTAuthMiddleware
import products.routing
import orders.routing
import activities.routing
import authapp.routing

# Unprotected /order/lock routes
order_lock_routes = orders.routing.websocket_urlpatterns

# Protected routes
protected_routes = (
    products.routing.websocket_urlpatterns +
    activities.routing.websocket_urlpatterns +
    authapp.routing.websocket_urlpatterns
)

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": JWTAuthMiddleware(  # Apply middleware at the top level
        URLRouter([
            *order_lock_routes,      # Unprotected routes
            *protected_routes        # Protected routes (both go through middleware)
        ])
    )
})