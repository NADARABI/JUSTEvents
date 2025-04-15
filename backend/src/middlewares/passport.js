// src/middlewares/passport.js
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';
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

// MICROSOFT STRATEGY
passport.use(new MicrosoftStrategy({
    clientID: process.env.MICROSOFT_CLIENT_ID,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
    callbackURL: process.env.MICROSOFT_CALLBACK_URL,
    scope: ['user.read'],
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      const name = profile.displayName;
  
      let user = await User.findByEmail(email);
      if (!user) {
        let autoRole = 'Pending';
  
        // Auto-assign student if @college.just.edu.jo
        if (email.endsWith('@college.just.edu.jo')) {
          autoRole = 'Student';
        }
  
        user = await User.create({
          name,
          email,
          provider: 'Microsoft',
          is_verified: true,
          role: autoRole,
        });
      }
  
      return done(null, user);
    } catch (err) {
      return done(err);
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
  