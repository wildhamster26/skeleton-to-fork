import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format'],
    },
    password: {
      type: String,
      minlength: 8,
      select: false,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    provider: {
      type: String,
      enum: ['local', 'google', 'facebook', 'apple'],
      default: 'local',
    },
    providerId: {
      type: String,
    },
    subscription: {
      lemonSqueezyId: String,
      status: {
        type: String,
        enum: ['active', 'cancelled', 'expired', 'none'],
        default: 'none',
      },
      plan: String,
      currentPeriodEnd: Date,
    },
  },
  { timestamps: true }
);

// Password is required only for local accounts
userSchema.pre('validate', function (next) {
  if (this.provider === 'local' && !this.password) {
    this.invalidate('password', 'Password is required for local accounts');
  }
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  try {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.statics.findOrCreateOAuth = async function ({ provider, providerId, email, name }) {
  // Try finding by provider + providerId first
  let user = await this.findOne({ provider, providerId });
  if (user) return user;

  // Try finding by email — link accounts if email matches
  user = await this.findOne({ email });
  if (user) {
    user.provider = provider;
    user.providerId = providerId;
    await user.save();
    return user;
  }

  // Create new user
  return this.create({ provider, providerId, email, name });
};

// Strip password from JSON output
userSchema.set('toJSON', {
  transform(_doc, ret) {
    delete ret.password;
    return ret;
  },
});

export default mongoose.model('User', userSchema);
