const BASE_URL = 'https://api.lemonsqueezy.com/v1';
const TIMEOUT_MS = 10_000;

function headers() {
  return {
    Accept: 'application/vnd.api+json',
    'Content-Type': 'application/vnd.api+json',
    Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
  };
}

function fetchWithTimeout(url, options = {}) {
  return fetch(url, {
    ...options,
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
}

export async function createCheckout({ storeId, variantId, userEmail, userId }) {
  const res = await fetchWithTimeout(`${BASE_URL}/checkouts`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      data: {
        type: 'checkouts',
        attributes: {
          checkout_data: {
            email: userEmail,
            custom: { user_id: userId },
          },
        },
        relationships: {
          store: { data: { type: 'stores', id: storeId } },
          variant: { data: { type: 'variants', id: variantId } },
        },
      },
    }),
  });

  if (!res.ok) {
    let detail = 'Failed to create checkout';
    try {
      const error = await res.json();
      detail = error.errors?.[0]?.detail || detail;
    } catch { /* non-JSON error response */ }
    throw new Error(detail);
  }

  const body = await res.json();
  const url = body?.data?.attributes?.url;
  if (!url) throw new Error('Invalid checkout response from payment provider');
  return url;
}

export async function getSubscription(subscriptionId) {
  const id = encodeURIComponent(subscriptionId);
  const res = await fetchWithTimeout(`${BASE_URL}/subscriptions/${id}`, {
    headers: headers(),
  });

  if (!res.ok) return null;

  const { data } = await res.json();
  return data;
}

export async function cancelSubscription(subscriptionId) {
  const id = encodeURIComponent(subscriptionId);
  const res = await fetchWithTimeout(`${BASE_URL}/subscriptions/${id}`, {
    method: 'DELETE',
    headers: headers(),
  });

  return res.ok;
}
