from datetime import date, timedelta 
from django.db.models import Sum, Count, Q 
from django.db.models.functions import TruncDate 
from rest_framework.views import APIView 
from rest_framework.response import Response 
from sales.models import Sale
from datetime import date, timedelta
from django.db.models.functions import TruncDate
from django.db.models import Sum, Count, Q
from django.utils.dateparse import parse_date
from datetime import date, timedelta
from orders.models import Order
from rest_framework.views import APIView 
from rest_framework.response import Response 
from orders.models import OrderItem 
from sales.models import Sale 
from django.utils.dateparse import parse_date 
from datetime import date, timedelta 
from django.db.models import Sum, Q 
from collections import defaultdict 
from products.models import Product

class ProductPerformanceView(APIView): 
    def get(self, request): 
        sales = Sale.objects.filter(refunded=False) 
        total_sales_amount = float(sales.aggregate(total=Sum('ordered_price'))['total'] or 0)
        order_ids = sales.values_list('order_id', flat=True)
        items = OrderItem.objects.filter(order_id__in=order_ids)

        product_amount_map = defaultdict(lambda: {'amount': 0, 'sku': '', 'name': ''})

        for item in items:
            if not item.product:
                continue
            key = item.product.id
            product_amount_map[key]['amount'] += float(item.price_at_purchase) * item.quantity
            product_amount_map[key]['sku'] = item.product.sku
            product_amount_map[key]['name'] = item.product.name

        result = []
        for data in product_amount_map.values():
            percentage = (data['amount'] / total_sales_amount) * 100 if total_sales_amount > 0 else 0
            result.append({
                'product': data['name'],
                'sku': data['sku'],
                'amount': round(data['amount'], 2),
                'percentage': round(percentage, 2)
            })

        result.sort(key=lambda x: x['amount'], reverse=True)
        return Response(result)

class ProductSalesCountReportView(APIView): 
    def get(self, request): 
        start = request.query_params.get('start') 
        end = request.query_params.get('end')

        if not start or not end:
            end_date = date.today()
            start_date = end_date - timedelta(days=30)
        else:
            start_date = parse_date(start)
            end_date = parse_date(end)

        order_ids = Sale.objects.filter(
            refunded=False,
            created_at__date__gte=start_date,
            created_at__date__lte=end_date
        ).values_list('order_id', flat=True)

        items = OrderItem.objects.filter(order_id__in=order_ids)

        product_counts = defaultdict(lambda: {'count': 0, 'sku': '', 'name': ''})
        for item in items:
            if not item.product:
                continue
            pid = item.product.id
            product_counts[pid]['count'] += item.quantity
            product_counts[pid]['sku'] = item.product.sku
            product_counts[pid]['name'] = item.product.name

        result = [
            {
                'product': data['name'],
                'sku': data['sku'],
                'count': data['count']
            }
            for data in product_counts.values()
        ]

        result.sort(key=lambda x: x['count'], reverse=True)
        return Response(result)



ORDER_STATUSES = [
    'pending', 'confirmed', 'processing', 'hold',
    'shipped', 'delivered', 'cancelled', 'returned', 'failed'
]

class OrderStatsView(APIView):
    def get(self, request):
        stats = {}
        total = Order.objects.count()

        for status in ORDER_STATUSES:
            stats[status] = Order.objects.filter(status=status).count()

        stats['total'] = total
        return Response(stats)


class OrderReportView(APIView):
    def get(self, request):
        start = request.query_params.get('start')
        end = request.query_params.get('end')

        if not start or not end:
            end_date = date.today()
            start_date = end_date - timedelta(days=30)
        else:
            start_date = parse_date(start)
            end_date = parse_date(end)

        qs = Order.objects.filter(
            created_at__date__gte=start_date,
            created_at__date__lt=end_date + timedelta(days=1)
        )

        daily = qs.annotate(day=TruncDate('created_at')) \
            .values('day') \
            .annotate(
                count=Count('id'),
                rejections=Count('id', filter=Q(status__in=['cancelled', 'returned', 'failed']))
            ).order_by('day')

        data_map = {d['day']: d for d in daily}
        full_data = []
        current = start_date
        while current <= end_date:
            record = data_map.get(current, {
                'day': current,
                'count': 0,
                'rejections': 0
            })
            full_data.append({
                'day': record['day'],
                'orders': record['count'],
                'rejections': record['rejections']
            })
            current += timedelta(days=1)

        return Response(full_data)
        
class SalesReportView(APIView):
    def get(self, request):
        start = request.query_params.get('start')
        end = request.query_params.get('end')

        if not start or not end:
            end_date = date.today()
            start_date = end_date - timedelta(days=30)
        else:
            start_date = parse_date(start)
            end_date = parse_date(end)

        # â Ensure inclusive filtering of end_date
        qs = Sale.objects.filter(
            created_at__date__gte=start_date,
            created_at__date__lt=end_date + timedelta(days=1)
        )

        daily = qs.annotate(day=TruncDate('created_at')) \
            .values('day') \
            .annotate(
                sales=Sum('ordered_price', filter=Q(refunded=False)),
                profit=Sum('profit', filter=Q(refunded=False)),
                refunds=Count('id', filter=Q(refunded=True))
            ).order_by('day')

        data_map = {d['day']: d for d in daily}
        full_data = []
        current = start_date
        while current <= end_date:
            record = data_map.get(current, {
                'day': current,
                'sales': 0,
                'profit': 0,
                'refunds': 0,
            })
            full_data.append({
                'day': record['day'],
                'sales': float(record['sales'] or 0),
                'profit': float(record['profit'] or 0),
                'refunds': record['refunds'],
            })
            current += timedelta(days=1)

        return Response(full_data)
    
class SalesSummaryView(APIView):
    def get(self, request):
        start = request.query_params.get('start')
        end = request.query_params.get('end')

        sales_qs = Sale.objects.all()
        if start:
            sales_qs = sales_qs.filter(created_at__gte=parse_date(start))
        if end:
            sales_qs = sales_qs.filter(created_at__lte=parse_date(end))

        total_sales_count = sales_qs.filter(refunded=False).count()
        total_sales_amount = sales_qs.filter(refunded=False).aggregate(total=Sum('ordered_price'))['total'] or 0
        total_profit = sales_qs.filter(refunded=False).aggregate(total=Sum('profit'))['total'] or 0
        total_refunds = sales_qs.filter(refunded=True).count()

        return Response({
            "sales_count": total_sales_count,
            "sales_amount": float(total_sales_amount),
            "total_profit": float(total_profit),
            "refunds": total_refunds
        })
