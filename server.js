const express = require('express');
const session = require('express-session');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(session({
  secret: 'beanmachine-secret',
  resave: false,
  saveUninitialized: true
}));

const DATA_FILE = path.join(__dirname, 'users.json');

function loadData() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return { users: [] };
  }
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

let db = loadData();

function findUser(username) {
  return db.users.find(u => u.username === username);
}

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'username and password required' });
  }
  let user = findUser(username);
  if (!user) {
    // Auto register new user
    user = { username, password, tickets: [] };
    db.users.push(user);
    saveData(db);
  } else if (user.password !== password) {
    return res.status(401).json({ error: 'invalid credentials' });
  }
  req.session.user = username;
  res.json({ message: 'logged in' });
});

app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ message: 'logged out' });
  });
});

function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ error: 'not logged in' });
  }
  next();
}

app.get('/tickets', requireLogin, (req, res) => {
  const user = findUser(req.session.user);
  res.json(user.tickets);
});

app.post('/tickets', requireLogin, (req, res) => {
  const { items, total } = req.body;
  if (!Array.isArray(items) || typeof total !== 'number') {
    return res.status(400).json({ error: 'invalid ticket format' });
  }
  const ticket = { items, total, timestamp: new Date().toISOString() };
  const user = findUser(req.session.user);
  user.tickets.push(ticket);
  saveData(db);
  res.json({ message: 'ticket saved' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
