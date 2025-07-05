// server.js
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS для фронта (замените на свой домен)
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-domain.com'],
  credentials: true
}));

app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // secure: true если HTTPS
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(new SteamStrategy({
  returnURL: process.env.STEAM_RETURN_URL || 'https://your-domain.com/auth/steam/callback',
  realm: process.env.STEAM_REALM || 'https://your-domain.com/',
  apiKey: process.env.STEAM_API_KEY
}, (identifier, profile, done) => {
  process.nextTick(() => {
    profile.identifier = identifier;
    return done(null, profile);
  });
}));

// Steam OpenID routes
app.get('/auth/steam', passport.authenticate('steam', { failureRedirect: '/' }), (req, res) => {});
app.get('/auth/steam/callback',
  passport.authenticate('steam', { failureRedirect: '/' }),
  (req, res) => {
    // Можно выдать JWT или просто редирект на фронт
    res.redirect(process.env.FRONTEND_URL || '/');
  }
);

// API для получения данных пользователя
app.get('/api/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// Пример API для заказов (заглушка)
app.post('/api/order', express.json(), (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).json({ error: 'Not authenticated' });
  // Здесь логика создания заказа
  res.json({ status: 'ok', order: req.body });
});

app.listen(PORT, () => console.log(`Backend запущен на http://localhost:${PORT}`));
