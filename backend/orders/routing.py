from django.urls import path, re_path
from .consumers import OrderConsumer, OrderLockConsumer

websocket_urlpatterns = [
    path("ws/orders/", OrderConsumer.as_asgi()),
    path("ws/order/lock/", OrderLockConsumer.as_asgi()),
]