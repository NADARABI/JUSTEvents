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
  session: false,
}, async (accessToken, refreshToken, profile, done) => {
  console.log("Full Google Profile Data →", JSON.stringify(profile, null, 2));

  try {
    if (!profile.emails || !profile.emails.length) {
      console.error("Google account does not have a public email address.");
      return done(null, false, { message: "No email address associated with this Google account." });
    }

    const email = profile.emails[0].value;
    const name = profile.displayName ?? "Google User";

    // Check if user already exists
    let user = await User.findByEmail(email);

    if (!user) {
      console.log("User not found. Creating new user...");

      const userId = await User.create({
        name,
        email,
        password_hash: null,
        provider: 'Google',
        is_verified: true,
        role: 'Pending',
        requested_role: null,
        verification_code: null,
        attachment: null,
      });

      user = await User.findById(userId);
    }

    console.log("User found or created →", user);

    // Fix: Pass the full user object instead of just the ID
    done(null, user); 
  } catch (err) {
    console.error("Error in Google Strategy:", err.message);
    done(err);
  }
}));


// MICROSOFT STRATEGY 
passport.use(new MicrosoftStrategy({
  clientID: process.env.MICROSOFT_CLIENT_ID,
  clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
  callbackURL: process.env.MICROSOFT_CALLBACK_URL,
  scope: ['user.read'],
  session: false,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    const name = profile.displayName;

    let user = await User.findByEmail(email);
    if (!user) {
      const justStudentRegex = /@([a-z]+\.)*just\.edu\.jo$/i;
      const role = justStudentRegex.test(email) ? 'Student' : 'Pending';
      const userId = await User.create({
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
      user = await User.findById(userId);
    }

    done(null, user);
  } catch (err) {
    done(err);
  }
}));

// SERIALIZE / DESERIALIZE
// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   const user = await User.findById(id);
//   done(null, user);
// });

  