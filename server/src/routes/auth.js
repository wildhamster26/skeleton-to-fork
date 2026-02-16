import { Router } from 'express';
import passport from '../config/passport.js';
import { signToken } from '../middleware/auth.js';

const router = Router();
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

function oauthCallback(req, res) {
  const token = signToken(req.user._id);
  res.redirect(`${CLIENT_URL}/auth/callback?token=${encodeURIComponent(token)}`);
}

// Google
router.get('/google', passport.authenticate('google', { session: false, scope: ['profile', 'email'] }));
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${CLIENT_URL}/login?error=oauth_failed` }),
  oauthCallback
);

// Facebook
router.get('/facebook', passport.authenticate('facebook', { session: false, scope: ['email'] }));
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { session: false, failureRedirect: `${CLIENT_URL}/login?error=oauth_failed` }),
  oauthCallback
);

// Apple
router.get('/apple', passport.authenticate('apple', { session: false }));
router.post(
  '/apple/callback',
  passport.authenticate('apple', { session: false, failureRedirect: `${CLIENT_URL}/login?error=oauth_failed` }),
  oauthCallback
);

export default router;
