from rest_framework import viewsets, status, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from activities.utils import log_activity
from .models import Order
from .serializers import OrderSerializer
from .filters import OrderFilter
from rest_framework import generics
from .models import ReadyForCourier
from .serializers import ReadyForCourierSerializer
from rest_framework import generics, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.cache import cache
from .utils import send_order_to_courier
from rest_framework.exceptions import ValidationError

class SendToCourierView(APIView):
    def post(self, request, *args, **kwargs):
        order_id = request.data.get("order_id")

        if not order_id:
            return Response({"success": False, "message": "Missing order_id"}, status=status.HTTP_400_BAD_REQUEST)

        result = send_order_to_courier(order_id)

        if not result["success"]:
            return Response(result, status=status.HTTP_404_NOT_FOUND)

        return Response(result, status=status.HTTP_200_OK)
    
class ReadyForCourierListView(generics.ListAPIView):
    queryset = ReadyForCourier.objects.select_related('order').all()
    serializer_class = ReadyForCourierSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    pagination_class = None
    # Filtering
    filterset_fields = {
        'order__city_id': ['exact'],
        'order__zone_id': ['exact'],
    }
    
    # Searching
    search_fields = [
        'order__full_name',
        'order__phone',
        'order__shipping_address'
    ]

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer

    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filterset_class = OrderFilter
    search_fields = ['full_name', 'phone','id', 'shipping_address', 'c_id']
    ordering_fields = ['created_at']
    ordering = ['-created_at']
    
    def perform_update(self, serializer):
        if serializer.instance.status in ['delivered','partially_delivered']:
            raise ValidationError("Can't edit order that has been delivered or partially delivered") 
        old_status = serializer.instance.status  # previous status before save
        order = serializer.save()

        log_activity(
            user=self.request.user,
            action='order.update',
            message=f"Order #{order.id} updated"
        )

    # If status changed, log it specifically
        if old_status != order.status:
            log_activity(
                user=self.request.user,
                action='order.status.change',
                message=f"Order #{order.id} status changed from {old_status} to {order.status}"
            )

    def perform_create(self, serializer):
        session_id = self.request.session.session_key
        if not session_id:
            self.request.session.create()
            session_id = self.request.session.session_key

        order = serializer.save(session_id=session_id)

        # â Save Redis key for thank-you verification (expires in 1 minute)
        cache.set(f"order:thank-you:{str(order.id)}", '1', timeout=300)
        v = cache.get(f"order:thank-you:{str(order.id)}")
        print(f"VERIFYING: {v}")
        log_activity(
            user=self.request.user,
            action='order.create',
            message=f"Order #{order.id} created for {order.full_name}"
        )

    @action(detail=False, methods=['get'])
    def verify(self, request):
        order_id = request.query_params.get('order_id')

        if not order_id:
            return Response({'valid': False,'reason':'Order id missing'}, status=status.HTTP_400_BAD_REQUEST)

        key = f"order:thank-you:{str(order_id)}"
        exists = cache.get(key) == '1'
        print(f"{key} EXISTS -> {exists}\n")

        if exists:
            cache.delete(key)
            return Response({'valid': True}, status=status.HTTP_200_OK)
        else:
            return Response({'valid': False}, status=status.HTTP_200_OK)

    # â Add this custom action
    @action(detail=True, methods=['post'])
    def ship(self, request, pk=None):
        result = send_order_to_courier(pk)

        if not result["success"]:
            return Response(result, status=status.HTTP_400_BAD_REQUEST)

        return Response(result, status=status.HTTP_200_OK)
