from orders.models import Order
import requests

def get_horin_summary(phone_number, api_key):
    """
    Fetch courier summary from Hoorin API for the given phone number.
    """
    url = f"https://dash.hoorin.com/api/courier/search"
    params = {
        "apiKey": api_key,
        "searchTerm": phone_number
    }

    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()  # Raise error for bad status codes
        data = response.json()

        return data['Summaries']

    except requests.exceptions.RequestException as e:
        # Handle network/API errors
        print(f"Error fetching Hoorin summary: {e}")
        return {
            "error": str(e)
        }
    
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

        return data['totalSummary']

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
        'Delivered Parcels': delivered,
        'Canceled Parcels': cancelled,
    }