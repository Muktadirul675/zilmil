from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404



class CartViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    def get_cart(self, request):
        session_id = request.session.session_key
        if not session_id:
            request.session.create()
            session_id = request.session.session_key
        cart, created = Cart.objects.get_or_create(session_id=session_id)
        return cart

    def list(self, request):
        cart = self.get_cart(request)

        # Clean invalid items
        valid_items = []
        for item in cart.items.all():
            product = item.product
            variant = item.variant
            color = item.color

            # Skip if product is deleted, inactive, or out of stock
            if not product.is_active or product.stock == 0:
                item.delete()
                continue

            # Skip if variant exists and has no stock or doesn't belong
            if variant:
                if variant.product_id != product.id or variant.stock == 0:
                    item.delete()
                    continue

            # Skip if color exists but doesn't belong
            if color and color.product_id != product.id:
                item.delete()
                continue

            valid_items.append(item)

        # Re-fetch after cleanup
        cart.refresh_from_db()
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    def add_item(self, request):
        cart = self.get_cart(request)
        serializer = CartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        product = serializer.validated_data['product']
        variant = serializer.validated_data.get('variant', None)
        color = serializer.validated_data.get('color', None)
        quantity = serializer.validated_data.get('quantity', 1)

        cart_item_qs = CartItem.objects.filter(cart=cart, product=product, variant=variant, color=color)
        if cart_item_qs.exists():
            cart_item = cart_item_qs.first()
            new_quantity = cart_item.quantity + quantity

            stock_limit = variant.stock if variant else product.stock
            if new_quantity > stock_limit:
                return Response(
                    {"detail": f"Cannot add {quantity} items. Only {stock_limit - cart_item.quantity} more available."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            cart_item.quantity = new_quantity
            cart_item.save()
        else:
            CartItem.objects.create(cart=cart, product=product, variant=variant, color=color, quantity=quantity)

        cart.refresh_from_db()
        return Response(CartSerializer(cart).data, status=status.HTTP_201_CREATED)

    def update_item(self, request, pk=None):
        cart = self.get_cart(request)
        cart_item = get_object_or_404(CartItem, pk=pk, cart=cart)
        serializer = CartItemSerializer(cart_item, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        cart.refresh_from_db()
        return Response(CartSerializer(cart).data)

    def remove_item(self, request, pk=None):
        cart = self.get_cart(request)
        cart_item = get_object_or_404(CartItem, pk=pk, cart=cart)
        cart_item.delete()
        cart.refresh_from_db()
        return Response(status=status.HTTP_204_NO_CONTENT)