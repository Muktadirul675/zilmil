from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from orders.models import Order
from .utils import create_sale_from_order, mark_sale_as_refunded

# Store previous status before saving
@receiver(pre_save, sender=Order)
def cache_old_order_status(sender, instance, **kwargs):
    if instance.pk:
        try:
            old_instance = Order.objects.get(pk=instance.pk)
            instance._old_status = old_instance.status
        except Order.DoesNotExist:
            instance._old_status = None

# After saving, compare old vs new status
@receiver(post_save, sender=Order)
def handle_order_status_change(sender, instance, created, **kwargs):
    if created:
        return

    old_status = getattr(instance, '_old_status', None)
    new_status = instance.status

    if new_status == 'delivered' and old_status != 'delivered':
        create_sale_from_order(instance)

    elif new_status == 'returned' and old_status == 'delivered':
        mark_sale_as_refunded(instance)