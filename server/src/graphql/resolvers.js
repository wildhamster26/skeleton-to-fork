import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { signToken, requireAuth, requireAdmin } from '../middleware/auth.js';
import {
  createCheckout,
  cancelSubscription as lsCancelSub,
} from '../services/lemonSqueezy.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_USERS_LIMIT = 100;

// Dummy hash for constant-time login rejection when user doesn't exist
const DUMMY_HASH = bcrypt.hashSync('dummy-password-for-timing', 12);

function validateRegisterInput({ email, password, name }) {
  if (!EMAIL_RE.test(email)) throw new Error('Invalid email format');
  if (password.length < 8) throw new Error('Password must be at least 8 characters');
  if (name.length < 1 || name.length > 100) throw new Error('Name must be 1-100 characters');
}

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
      const safeLimit = Math.min(Math.max(1, limit), MAX_USERS_LIMIT);
      const safeOffset = Math.max(0, offset);
      return User.find().sort({ createdAt: -1 }).skip(safeOffset).limit(safeLimit).lean();
    },
  },

  Mutation: {
    async register(_parent, args) {
      validateRegisterInput(args);

      try {
        const user = await User.create({
          email: args.email,
          password: args.password,
          name: args.name,
        });
        const token = signToken(user._id);
        return { token, user };
      } catch (err) {
        // Handle duplicate key error from unique index
        if (err.code === 11000) throw new Error('Email already in use');
        throw err;
      }
    },

    async login(_parent, { email, password }) {
      const user = await User.findOne({ email }).select('+password');

      // Always run bcrypt to prevent timing-based user enumeration
      const isValid = user
        ? await user.comparePassword(password)
        : await bcrypt.compare(password, DUMMY_HASH);

      if (!user || !isValid) {
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
