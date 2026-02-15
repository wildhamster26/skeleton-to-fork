const BASE_URL = 'https://api.lemonsqueezy.com/v1';

function headers() {
  return {
    Accept: 'application/vnd.api+json',
    'Content-Type': 'application/vnd.api+json',
    Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
  };
}

export async function createCheckout({ storeId, variantId, userEmail, userId }) {
  const res = await fetch(`${BASE_URL}/checkouts`, {
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
    const error = await res.json();
    throw new Error(error.errors?.[0]?.detail || 'Failed to create checkout');
  }

  const { data } = await res.json();
  return data.attributes.url;
}

export async function getSubscription(subscriptionId) {
  const res = await fetch(`${BASE_URL}/subscriptions/${subscriptionId}`, {
    headers: headers(),
  });

  if (!res.ok) return null;

  const { data } = await res.json();
  return data;
}

export async function cancelSubscription(subscriptionId) {
  const res = await fetch(`${BASE_URL}/subscriptions/${subscriptionId}`, {
    method: 'DELETE',
    headers: headers(),
  });

  return res.ok;
}
