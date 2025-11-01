// src/utils/pixel.js
export function loadFacebookPixel(pixelId) {
return;
  if (window.fbq) return; // Already loaded
  
  // Load Facebook Pixel script
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  
  // Initialize Pixel
  fbq('init', pixelId);
}
export function trackPageView(pageData = {}) {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'PageView',
      ...pageData
    });
  }
}

export function trackViewContent(contentData) {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'ViewContent',
      ...contentData
    });
  }
}

export function trackViewCategory(categoryData) {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'ViewCategory',
      ...categoryData
    });
  }
}

export function trackAddToCart(productData) {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'AddToCart',
      ...productData
    });
  }
}

export function trackPurchase(orderData) {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'Purchase',
      ...orderData
    });
  }
}

export function trackInitiateCheckout(checkoutData) {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'InitiateCheckout',
      ...checkoutData
    });
  }
}