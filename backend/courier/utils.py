from orders.models import Order
import requests

def get_horin_summary(phone_number, api_key):
    """
    Fetch courier summary from Hoorin API for the given phone number
    and normalize the keys to:
    'Total Parcels', 'Total Delivered', 'Total Canceled'.
    """
    url = "https://dash.hoorin.com/api/courier/search"
    params = {
        "apiKey": api_key,
        "searchTerm": phone_number
    }

    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        summaries = data.get('Summaries', {})

        normalized = {}
        for courier, stats in summaries.items():
            total_parcels = stats.get('Total Parcels') or stats.get('Total Delivery') or 0
            total_delivered = stats.get('Delivered Parcels') or stats.get('Successful Delivery') or 0
            total_canceled = stats.get('Canceled Parcels') or stats.get('Canceled Delivery') or 0

            normalized[courier] = {
                "Total Parcels": total_parcels,
                "Total Delivered": total_delivered,
                "Total Canceled": total_canceled
            }

        return normalized

    except requests.exceptions.RequestException as e:
        print(f"Error fetching Hoorin summary: {e}")
        return {"error": str(e)}
    
def get_horin_parcel_summary(phone_number, api_key):
    """
    Fetch courier summary from Hoorin API for the given phone number.
    """
    url = f"https://dash.hoorin.com/api/courier/sheet"
    params = {
        "apiKey": api_key,
        "searchTerm": phone_number
    }

    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()  # Raise error for bad status codes
        data = response.json()
        print(data)
        return data['Summaries']

    except requests.exceptions.RequestException as e:
        # Handle network/API errors
        print(f"Error fetching Hoorin summary: {e}")
        return {
            "error": str(e)
        }

def get_own_order_records(number):
    orders = Order.objects.filter(phone=number)

    total = orders.exclude(status='cancelled').count()  # all except cancelled
    delivered = orders.filter(status='delivered').count()
    cancelled = orders.filter(status='cancelled').count()

    return {
        'Total Parcels': total,
        'Total Delivered': delivered,
        'Total Canceled': cancelled,
    }