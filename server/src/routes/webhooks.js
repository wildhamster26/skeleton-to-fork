import express, { Router } from 'express';
import crypto from 'node:crypto';
import User from '../models/User.js';

const router = Router();

function verifySignature(rawBody, signature) {
  const hmac = crypto.createHmac('sha256', process.env.LEMONSQUEEZY_WEBHOOK_SECRET);
  const digest = hmac.update(rawBody).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

// Raw body parser for webhook signature verification
router.post('/lemonsqueezy', express.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.headers['x-signature'];
  if (!signature || !verifySignature(req.body, signature)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const event = JSON.parse(req.body.toString());
  const eventName = event.meta.event_name;
  const userId = event.meta.custom_data?.user_id;

  if (!userId) return res.json({ received: true });

  const update = {};

  switch (eventName) {
    case 'subscription_created':
    case 'subscription_updated':
      update['subscription.lemonSqueezyId'] = String(event.data.id);
      update['subscription.status'] = event.data.attributes.status === 'active' ? 'active' : 'cancelled';
      update['subscription.plan'] = event.data.attributes.variant_name;
      update['subscription.currentPeriodEnd'] = event.data.attributes.renews_at;
      break;

    case 'subscription_cancelled':
      update['subscription.status'] = 'cancelled';
      break;

    case 'subscription_expired':
      update['subscription.status'] = 'expired';
      break;

    default:
      return res.json({ received: true });
  }

  await User.findByIdAndUpdate(userId, { $set: update });
  res.json({ received: true });
});

export default router;
