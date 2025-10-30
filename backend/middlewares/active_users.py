from django.utils import timezone
from django.core.cache import cache

class ActiveUserMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        if request.user.is_authenticated:
            now = timezone.now().isoformat()

            # 1ï¸â£ Store last active (never expires)
            cache.set(f"user:last-active:{request.user.id}", now)

            # 2ï¸â£ Active flag (expires in 5 minutes)
            cache.set(f"user:active:{request.user.id}", 1, timeout=60*5)

        return response