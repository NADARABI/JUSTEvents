// src/middlewares/passport.js
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:5000/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if the user exists
    let user = await User.findByEmail(profile.emails[0].value);
    if (!user) {
      // If user does not exist, create a new one
      user = await User.create({
        name: profile.displayName,
        email: profile.emails[0].value,
        provider: 'Google',  // Store the provider as Google
        is_verified: true,   // Automatically verified
      });
    }
    done(null, user);  // Proceed with user info
  } catch (err) {
    done(err);
  }
}));

//serialization and deserialization to manage user sessions
passport.serializeUser((user, done) => {
    done(null, user.id);  // Store user ID in session
  }
);

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);  // Retrieve user from the database
    done(null, user);  // Store user info in session
  }
);
  