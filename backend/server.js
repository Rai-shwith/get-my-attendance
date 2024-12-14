// backend/server.js

const express = require('express');
const session = require('express-session');
const path = require('path');
const hostRoutes = require('./routes/hostRoutes');
const bodyParser = require('body-parser');
const registerRoutes = require('./routes/registerRoutes');
const deleteCookieRoutes = require('./routes/deleteCookieRoutes');

const app = express();

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Cookie Parser middleware
host.use(cookieParser(SECRET_KEY));

// Static files (e.g., images, styles)
app.use(express.static(path.join(__dirname, 'public')));

// Use the route handlers
app.use('/', hostRoutes);
app.use('/', attendanceRoutes);
app.use('/', registerRoutes);
app.use('/', deleteCookieRoutes);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
