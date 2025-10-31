from channels.generic.websocket import AsyncWebsocketConsumer
import json

# consumers.py
import json
from urllib.parse import parse_qs
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth import get_user_model
from django.core.cache import cache

User = get_user_model()
LOCK_PREFIX = "order:lock:"  # cache key prefix
LOCK_EXPIRY = 300  # 5 minutes

class OrderLockConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer to manage order locks.
    
    Query params:
      - id=<order_id>       â lock this order for the given user
      - user_id=<user_id>   â ID of the user trying to lock
    """

    async def connect(self):
        self.group_name = "order_lock_group"
        self.locked_orders = set()  # orders this connection owns

        query_params = parse_qs(self.scope["query_string"].decode())
        self.order_id = query_params.get("id", [None])[0]
        self.user_id = query_params.get("user_id", [None])[0]

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

        # Lock the order if both order_id and user_id are given
        if self.order_id and self.user_id:
            await self.lock_order(self.order_id)

        # Always broadcast all locks to everyone
        await self.broadcast_all_locks()

    async def disconnect(self, close_code):
        # Remove any locks this connection owns
        for order_id in self.locked_orders:
            cache_key = f"{LOCK_PREFIX}{order_id}"
            cached_user = cache.get(cache_key)
            if cached_user and self.user_id:
                try:
                    user = await User.objects.aget(id=self.user_id)
                    if cached_user == user.username:
                        cache.delete(cache_key)
                except User.DoesNotExist:
                    continue
        await self.broadcast_all_locks()
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data=None, bytes_data=None):
        """
        Handle client messages:
          - 'ping' â extend expiry
          - 'broadcast' â send all current locks
        """
        if not text_data:
            return

        try:
            data = json.loads(text_data)
        except json.JSONDecodeError:
            return

        action = data.get("action")

        if action == "ping":
            for order_id in self.locked_orders:
                cache_key = f"{LOCK_PREFIX}{order_id}"
                username = cache.get(cache_key)
                if username:
                    cache.set(cache_key, username, LOCK_EXPIRY)
            await self.broadcast_all_locks()
        elif action == "broadcast":
            await self.broadcast_all_locks()

    async def lock_order(self, order_id):
        """Try to lock the order if not already locked."""
        cache_key = f"{LOCK_PREFIX}{order_id}"
        existing_lock = cache.get(cache_key)

        if not existing_lock:
            try:
                user = await User.objects.aget(id=self.user_id)
            except User.DoesNotExist:
                return
            cache.set(cache_key, user.username, LOCK_EXPIRY)
            self.locked_orders.add(order_id)  # track ownership

    async def broadcast_all_locks(self):
        """Send all current locks to group."""
        keys = cache.keys(f"{LOCK_PREFIX}*")
        locks = {key.replace(LOCK_PREFIX, ""): cache.get(key) for key in keys}
        event = {
            "type": "send_lock_event",
            "locks": locks
        }
        await self.channel_layer.group_send(self.group_name, event)

    async def send_lock_event(self, event):
        """Handler for group broadcasts."""
        await self.send(text_data=json.dumps(event["locks"]))

class OrderConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("orders", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("orders", self.channel_name)

    async def receive(self, text_data):
        pass

    async def send_order_update(self, event):
        print("ORDER WS")
        await self.send(text_data=json.dumps(event["data"]))
