// src/middlewares/passport.js
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';
import User from '../models/User.js';

// GOOGLE STRATEGY
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:5000/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findByEmail(profile.emails[0].value);
    if (!user) {
      user = await User.create({
        name: profile.displayName,
        email: profile.emails[0].value,
        password_hash: null,
        provider: 'Google',
        is_verified: true,
        role: 'Pending',
        requested_role: null,
        verification_code: null,
        attachment: null,
      });
    }
    done(null, user);
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
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    const name = profile.displayName;

    let user = await User.findByEmail(email);
    if (!user) {
      const justStudentRegex = /@([a-z]+\.)*just\.edu\.jo$/i;
      const role = justStudentRegex.test(email) ? 'Student' : 'Pending';
      user = await User.create({
        name,
        email,
        password_hash: null,
        role,
        requested_role: null,
        is_verified: true,
        verification_code: null,
        provider: 'Microsoft',
        attachment: null
      });
      
    }

    done(null, user);
  } catch (err) {
    done(err);
  }
}));

// SERIALIZE / DESERIALIZE
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

  