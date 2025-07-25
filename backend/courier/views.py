from django.shortcuts import render

# Create your views here.

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .pathao_client import get_pathao_client
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.core.cache import cache

client = get_pathao_client()

@api_view(['GET'])
def get_delivery_charge(request):
    city_id = request.query_params.get('city_id')
    zone_id = request.query_params.get('zone_id')

    if not city_id or not zone_id:
        return Response({"detail": "city_id and zone_id are required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        response = client.get_delivery_cost(
            city_id=int(city_id),
            zone_id=int(zone_id),
            delivery_type=48,
            item_type='2',
            store_id=settings.PATHAO_STORE_ID
        )
        return Response(response, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_stores(request):
    try:
        stores = client.get_stores()
        return Response(stores, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def create_dummy_order(request):
    try:

        result = client.create_order(
            store_id="1",
            order_id="dummy1234",
            sender_name="Your Business",
            sender_phone="018xxxxxxxx",
            recipient_name="John Doe",
            recipient_phone="017xxxxxxxx",
            address="Somewhere in Dhaka",
            city_id=1,  # e.g., Dhaka
            zone_id=14,
            area_id=242,
            special_instruction="Handle with care",
            item_quantity=1,
            item_weight=1,
            amount_to_collect=500,
            item_description="Test Product"
        )


        return Response(result, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class CityListAPIView(APIView):
    def get(self, request):
        pathao_courier_cache_key = 'courier:pathao:cities'
        timeout = 3600
        try:
            cached_cities = cache.get(pathao_courier_cache_key)
            if cached_cities:
                return Response(cached_cities, status=status.HTTP_200_OK)
            cities = client.get_city_list()
            cache.set(pathao_courier_cache_key, cities, timeout=timeout)
            return Response(cities, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ZoneListAPIView(APIView):
    def get(self, request):
        city_id = request.query_params.get('city_id')
        if not city_id:
            return Response({'error': 'city_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        pathao_courier_cache_key = f'courier:pathao:{city_id}:zones'
        timeout = 3500
        try:
            cached_zones = cache.get(pathao_courier_cache_key)
            if cached_zones:
                return Response(cached_zones, status=status.HTTP_200_OK)
            zones = client.get_zone_list(city_id=int(city_id))
            cache.set(pathao_courier_cache_key, zones, timeout=timeout)
            return Response(zones, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AreaListAPIView(APIView):
    def get(self, request):
        zone_id = request.query_params.get('zone_id')
        if not zone_id:
            return Response({'error': 'zone_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        pathao_courier_cache_key = f'courier:pathao:{zone_id}:zones'
        timeout = 3400
        try:
            cached_areas = cache.get(pathao_courier_cache_key)
            if cached_areas:
                return Response(cached_areas, status=status.HTTP_200_OK)
            areas = client.get_area_list(zone_id=int(zone_id))
            cache.set(pathao_courier_cache_key, areas, timeout=timeout)
            return Response(areas, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
