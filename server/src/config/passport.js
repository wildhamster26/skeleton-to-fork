import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import AppleStrategy from 'passport-apple';
import User from '../models/User.js';

function buildCallbackURL(provider) {
  const base = process.env.SERVER_URL || `http://localhost:${process.env.PORT || 4000}`;
  return `${base}/auth/${provider}/callback`;
}

// Google
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: buildCallbackURL('google'),
        scope: ['profile', 'email'],
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const user = await User.findOrCreateOAuth({
            provider: 'google',
            providerId: profile.id,
            email: profile.emails?.[0]?.value,
            name: profile.displayName,
          });
          done(null, user);
        } catch (err) {
          done(err);
        }
      }
    )
  );
}

// Facebook
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: buildCallbackURL('facebook'),
        profileFields: ['id', 'emails', 'name', 'displayName'],
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const user = await User.findOrCreateOAuth({
            provider: 'facebook',
            providerId: profile.id,
            email: profile.emails?.[0]?.value,
            name: profile.displayName,
          });
          done(null, user);
        } catch (err) {
          done(err);
        }
      }
    )
  );
}

// Apple
if (process.env.APPLE_CLIENT_ID && process.env.APPLE_TEAM_ID && process.env.APPLE_KEY_ID) {
  passport.use(
    new AppleStrategy(
      {
        clientID: process.env.APPLE_CLIENT_ID,
        teamID: process.env.APPLE_TEAM_ID,
        keyID: process.env.APPLE_KEY_ID,
        privateKeyLocation: process.env.APPLE_PRIVATE_KEY_PATH,
        callbackURL: buildCallbackURL('apple'),
        scope: ['name', 'email'],
      },
      async (_accessToken, _refreshToken, idToken, profile, done) => {
        try {
          const user = await User.findOrCreateOAuth({
            provider: 'apple',
            providerId: idToken.sub,
            email: idToken.email,
            name: profile?.name?.firstName
              ? `${profile.name.firstName} ${profile.name.lastName || ''}`.trim()
              : idToken.email?.split('@')[0] || 'Apple User',
          });
          done(null, user);
        } catch (err) {
          done(err);
        }
      }
    )
  );
}

export default passport;
