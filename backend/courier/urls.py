from django.urls import path
from .views import CityListAPIView, ZoneListAPIView, AreaListAPIView

from django.urls import path
from .views import create_dummy_order, get_stores, get_delivery_charge

urlpatterns = [
    # path('dummy-order/', create_dummy_order, name='dummy-order'),
]

urlpatterns += [
    path('cities/', CityListAPIView.as_view()),
    path('zones/', ZoneListAPIView.as_view()),
    path('areas/', AreaListAPIView.as_view()),
    path("delivery-charge/", get_delivery_charge),
    path("stores/", get_stores),
]