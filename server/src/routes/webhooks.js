import express, { Router } from 'express';
import crypto from 'node:crypto';
import mongoose from 'mongoose';
import User from '../models/User.js';

const router = Router();

function verifySignature(rawBody, signature) {
  const hmac = crypto.createHmac('sha256', process.env.LEMONSQUEEZY_WEBHOOK_SECRET);
  const digest = hmac.update(rawBody).digest('hex');

  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature.toLowerCase(), 'utf8'),
      Buffer.from(digest.toLowerCase(), 'utf8')
    );
  } catch {
    return false;
  }
}

router.post('/lemonsqueezy', express.raw({ type: 'application/json', limit: '1mb' }), async (req, res) => {
  try {
    const signature = req.headers['x-signature'];
    if (!signature || !verifySignature(req.body, signature)) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const event = JSON.parse(req.body.toString());

    const eventName = event?.meta?.event_name;
    const userId = event?.meta?.custom_data?.user_id;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.json({ received: true });
    }

    const update = {};
    const attrs = event?.data?.attributes;

    switch (eventName) {
      case 'subscription_created':
      case 'subscription_updated':
        if (!attrs) return res.json({ received: true });
        update['subscription.lemonSqueezyId'] = String(event.data.id);
        update['subscription.status'] = attrs.status === 'active' ? 'active' : 'cancelled';
        update['subscription.plan'] = attrs.variant_name;
        update['subscription.currentPeriodEnd'] = attrs.renews_at;
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
  } catch (err) {
    console.error('Webhook processing error:', err);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

export default router;
