from django.urls import re_path,path
from . import consumers

websocket_urlpatterns = [
    re_path(r"^ws/page/(?P<path>[-\w/]+)/$", consumers.PageActivityConsumer.as_asgi()),
    path("ws/user/logout", consumers.LogoutConsumer.as_asgi()),
]