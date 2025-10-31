from urllib.parse import parse_qs
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from django.contrib.auth import get_user_model
import jwt
from django.conf import settings

User = get_user_model()


@database_sync_to_async
def get_user_from_token(token):
    """
    Decode JWT without checking expiration.
    Returns a User or AnonymousUser.
    """
    try:
        # Decode the token, ignore expiration
        decoded_data = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=["HS256"],
            options={"verify_exp": False}  # <-- ignore expiry
        )
        user_id = decoded_data.get("user_id")
        if user_id:
            return User.objects.get(id=user_id)
    except (jwt.DecodeError, User.DoesNotExist):
        pass
    return AnonymousUser()


class JWTAuthMiddleware:
    """
    Custom Channels middleware for JWT auth, ignoring expiry.
    Expects ?token=<access_token>
    """
    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        query_string = scope.get("query_string", b"").decode()
        query_params = parse_qs(query_string)
        token = query_params.get("token", [None])[0]

        if token:
            scope["user"] = await get_user_from_token(token)
        else:
            scope["user"] = AnonymousUser()

        return await self.inner(scope, receive, send)


def JWTAuthMiddlewareStack(inner):
    """
    Wrap like AuthMiddlewareStack
    """
    return JWTAuthMiddleware(inner)