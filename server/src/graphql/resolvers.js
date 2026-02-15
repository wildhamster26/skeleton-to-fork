import User from '../models/User.js';
import { signToken, requireAuth, requireAdmin } from '../middleware/auth.js';
import {
  createCheckout,
  cancelSubscription as lsCancelSub,
} from '../services/lemonSqueezy.js';

export default {
  Query: {
    me(_parent, _args, { user }) {
      requireAuth(user);
      return User.findById(user._id);
    },

    async adminStats(_parent, _args, { user }) {
      requireAdmin(user);

      const [totalUsers, activeSubscriptions, recentUsers] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ 'subscription.status': 'active' }),
        User.find().sort({ createdAt: -1 }).limit(10).lean(),
      ]);

      return { totalUsers, activeSubscriptions, recentUsers };
    },

    async users(_parent, { limit = 20, offset = 0 }, { user }) {
      requireAdmin(user);
      return User.find().sort({ createdAt: -1 }).skip(offset).limit(limit).lean();
    },
  },

  Mutation: {
    async register(_parent, { email, password, name }) {
      const exists = await User.findOne({ email });
      if (exists) throw new Error('Email already in use');

      const user = await User.create({ email, password, name });
      const token = signToken(user._id);
      return { token, user };
    },

    async login(_parent, { email, password }) {
      const user = await User.findOne({ email }).select('+password');
      if (!user || !(await user.comparePassword(password))) {
        throw new Error('Invalid email or password');
      }

      const token = signToken(user._id);
      return { token, user };
    },

    async createCheckoutUrl(_parent, { variantId }, { user }) {
      requireAuth(user);

      return createCheckout({
        storeId: process.env.LEMONSQUEEZY_STORE_ID,
        variantId,
        userEmail: user.email,
        userId: String(user._id),
      });
    },

    async cancelSubscription(_parent, _args, { user }) {
      requireAuth(user);

      const dbUser = await User.findById(user._id);
      if (!dbUser?.subscription?.lemonSqueezyId) {
        throw new Error('No active subscription');
      }

      const cancelled = await lsCancelSub(dbUser.subscription.lemonSqueezyId);
      if (cancelled) {
        dbUser.subscription.status = 'cancelled';
        await dbUser.save();
      }

      return cancelled;
    },
  },
};
