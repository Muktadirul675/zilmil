import json
from channels.generic.websocket import AsyncWebsocketConsumer
from urllib.parse import parse_qs

active_users = {}  # { safe_path: set(usernames) }

class PageActivityConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        raw_path = self.scope['url_route']['kwargs']['path']
        self.safe_path = raw_path.replace("/", "_")
        self.group_name = f"page_{self.safe_path}"
        user = self.scope["user"]

        # Parse query params
        query_params = parse_qs(self.scope["query_string"].decode())
        include_param = query_params.get("include", ["true"])[0].lower()  # default true

        # Only include user if include != "false"
        if user.is_authenticated and include_param != "false":
            active_users.setdefault(self.safe_path, set()).add(user.username)

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()
        print(active_users)
        await self.broadcast_active_users()

    async def disconnect(self, close_code):
        user = self.scope["user"]

        if user.is_authenticated and self.safe_path in active_users:
            active_users[self.safe_path].discard(user.username)

        await self.channel_layer.group_discard(self.group_name, self.channel_name)
        await self.broadcast_active_users()

    async def receive(self, text_data=None, bytes_data=None):
        pass

    async def broadcast_active_users(self):
        users = list(active_users.get(self.safe_path, []))
        await self.channel_layer.group_send(
            self.group_name,
            {
                "type": "send_users",
                "users": users,
            }
        )

    async def send_users(self, event):
        await self.send(text_data=json.dumps(event["users"]))