from .models import Sale
from orders.models import Order
from decimal import Decimal


def create_sale_from_order(order: Order):
    if Sale.objects.filter(order=order).exists():
        return  # Avoid duplicate

    profit = Decimal('0')
    for item in order.items.select_related('product'):
        product = item.product
        cost = product.cost_price or Decimal('0')
        profit += (item.price_at_purchase - cost) * item.quantity

    profit -= order.order_discount or Decimal('0')
    profit -= order.delivery_charge or Decimal('0')

    Sale.objects.create(
        order=order,
        ordered_price=order.total_price - order.delivery_charge,
        profit=profit,
    )


def mark_sale_as_refunded(order: Order):
    try:
        sale = order.sale
        sale.refunded = True
        sale.save()
    except Sale.DoesNotExist:
        pass