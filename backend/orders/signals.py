from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from .models import Order
from .utils import adjust_stock, get_stock_action, is_order_ready
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import Order
from .serializers import OrderSerializer
from enum import Enum
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Order, OrderItem, ReadyForCourier

@receiver([post_save, post_delete], sender=OrderItem)
@receiver(post_save, sender=Order)
def manage_ready_for_courier(sender, instance, **kwargs):
    order = instance.order if isinstance(instance, OrderItem) else instance
    ready = is_order_ready(order)

    if ready:
        ReadyForCourier.objects.get_or_create(order=order)
    else:
        ReadyForCourier.objects.filter(order=order).delete()

def prefix_order_event(event):
    return f"order.{event}"

class OrderAction(str, Enum):
    update = prefix_order_event('update')
    create = prefix_order_event('create')
    delete = prefix_order_event('delete')

@receiver(post_save, sender=Order)
def order_saved(sender, instance, created, **kwargs):
    print("ORDER SAVED")
    channel_layer = get_channel_layer()
    action = OrderAction.create if created else OrderAction.update
    data = {
        "type": "send_order_update",
        "data": {
            "type": "order",
            "action": action,
            "data": OrderSerializer(instance).data
        }
    }
    async_to_sync(channel_layer.group_send)("orders", data)

@receiver(post_delete, sender=Order)
def order_deleted(sender, instance, **kwargs):
    channel_layer = get_channel_layer()
    data = {
        "type": "send_order_update",
        "data": {
            "type": "order",
            "action": OrderAction.delete,
            "data": {"id": instance.id}
        }
    }
    async_to_sync(channel_layer.group_send)("orders", data)


@receiver(pre_save, sender=Order)
def handle_order_stock_adjustment(sender, instance, **kwargs):
    if not instance.pk:
        # New order creation â handled in create logic already
        return

    try:
        old_order = Order.objects.get(pk=instance.pk)
    except Order.DoesNotExist:
        return

    old_status = old_order.status
    new_status = instance.status

    action = get_stock_action(old_status, new_status, has_item_changes=False)

    if action != 'none':
        adjust_stock(instance.items.all(), action)