from django.db import models
from products.models import Product, Variant, Color
from decimal import Decimal
from django.contrib.auth import get_user_model
import re
from django.utils import timezone

User = get_user_model()
ORDER_PREFIX = 'Z'

def create36base(num: int):
    chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if num == 0:
        return chars[0]
        
    result = ""
    n = abs(num)
    while n > 0:
        n, remainder = divmod(n, 36)
        result = chars[remainder] + result
        
    return result

def getTimeStamp(time=None):
    # It is best practice not to use timezone.now() as a default argument
    # because it only evaluates once when the server starts.
    if time is None:
        time = timezone.now()
        
    return time.strftime("%d%m%y")

def createOrderId(id, date):
    return f"{ORDER_PREFIX}{getTimeStamp()}{create36base(id)}"

ORDER_STATUS_CHOICES = [
    ('pending', 'Pending'),
    ('confirmed', 'Confirmed'),
    ('hold', 'Hold'),
    ('processing', 'Processing'),
    ('shipped', 'Shipped'),
    ('delivered', 'Delivered'),
    ('partially_delivered', 'Partially Delivered'),
    ('cancelled', 'Cancelled'),
    ('returned', 'Returned'),
    ('failed', 'Failed'),
    ('partially_returned', 'Partially Returned'),
    ('paid_returned', 'Paid Returned'),
]

class Order(models.Model):
    z_id = models.CharField(max_length=20, db_index=True,null=True, blank=True)
    session_id = models.CharField(max_length=40)
    full_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    shipping_address = models.TextField()
    inside_dhaka = models.BooleanField(default=False) 
    order_discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    delivery_charge = models.DecimalField(max_digits=10, decimal_places=2, default=0, null=True, blank=True)

    courier = models.CharField(max_length=255, null=True, blank=True, default="pathao")
    sent_to_courier = models.BooleanField(default=False)
    c_id = models.CharField(max_length=255, null=True, blank=True)
    courier_status = models.CharField(max_length=50, default='pending')
    city_id = models.PositiveIntegerField(null=True, blank=True)
    zone_id = models.PositiveIntegerField(null=True, blank=True)
    area_id = models.PositiveIntegerField(null=True, blank=True)
    note = models.TextField(null=True, blank=True)
    order_note = models.TextField(null=True, blank=True, default='N/A')
    status = models.CharField(max_length=20, choices=ORDER_STATUS_CHOICES, default='pending')
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    collected_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    source = models.CharField(max_length=20, default='organic')
    courier_reason = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    confirmed_by = models.ForeignKey(User, related_name='confirm_orders', null=True, blank=True, default=None, on_delete=models.SET_NULL)
    confirmed_by_name = models.TextField(null=True, blank=True, default=None)
    confirmed_by_date = models.DateTimeField(null=True, blank=True, default=None)

    def calculate_total_price(self):
        items_total = sum([item.total_price() for item in self.items.all()])
        total = items_total + (self.delivery_charge or 0)
        return total - self.order_discount if total > self.order_discount else 0

    @staticmethod
    def normalize_bd_number(number: str) -> str:
        """
        Normalize BD phone number to standard 01XXXXXXXXX format
        """
        if not number:
            return ''
        # Remove all non-digit characters
        number = re.sub(r'\D', '', number)

        # Remove leading country code variations
        if number.startswith('8801'):
            number = '0' + number[3:]
        elif number.startswith('01'):
            pass  # already good
        elif number.startswith('801'):  # rare, 801XXXX
            number = '0' + number[1:]
        return number

    def save(self, *args, **kwargs):
        # Normalize phone number before saving
        self.phone = self.normalize_bd_number(self.phone)

        # Save first to ensure order has an ID for items
        super().save(*args, **kwargs)

        # Calculate total price
        self.total_price = self.calculate_total_price()
        if not self.z_id:
            self.z_id = createOrderId(self.id,self.created_at)
        super().save(update_fields=['total_price', 'phone','z_id'])

    def __str__(self):
        return f"Order #{self.id} - {self.full_name}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, related_name="order_items", on_delete=models.PROTECT)
    variant = models.ForeignKey(Variant, null=True, blank=True, on_delete=models.SET_NULL)
    color = models.ForeignKey(Color, null=True, blank=True, on_delete=models.SET_NULL)
    quantity = models.PositiveIntegerField()
    price_at_purchase = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def total_price(self):
        return Decimal(self.price_at_purchase * self.quantity)

class ReadyForCourier(models.Model):
    order = models.OneToOneField('Order', on_delete=models.CASCADE, related_name='ready_status')
    created_at = models.DateTimeField(auto_now_add=True)
