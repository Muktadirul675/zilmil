from django.contrib.auth import get_user_model
from django.core.cache import cache

def get_user_activity():
    User = get_user_model()
    users = User.objects.all()

    active_users = []
    inactive_users = []

    for user in users:
        last_active = cache.get(f"user:last-active:{user.id}")
        is_active = cache.get(f"user:active:{user.id}") is not None

        if last_active is None:
            # fallback if user never active
            last_active = user.date_joined.isoformat()

        user_data = {
            "id": user.id,
            "name": user.get_full_name() or user.username,
            "last_active": last_active,
            "is_active": is_active
        }

        if is_active:
            active_users.append(user_data)
        else:
            inactive_users.append(user_data)

    return {
        "active_count": len(active_users),
        "active_users": active_users,
        "inactive_users": inactive_users,
    }