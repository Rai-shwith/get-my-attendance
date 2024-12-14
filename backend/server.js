// backend/server.js

const express = require('express');
const session = require('express-session');
const path = require('path');
const hostRoutes = require('./routes/hostRoutes');
const bodyParser = require('body-parser');
const registerRoutes = require('./routes/registerRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const deleteCookieRoutes = require('./routes/deleteCookieRoutes');

const app = express();

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Cookie Parser middleware
host.use(cookieParser(SECRET_KEY));

// Static files (e.g., images, styles)
app.use(express.static(path.join(__dirname, 'public')));

// Set 'views' directory for any views being rendered
app.set('views', path.join(__dirname, 'views'));

// Set EJS as the view engine
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

// Use the route handlers
app.use('/', hostRoutes);
app.use('/', attendanceRoutes);
app.use('/', registerRoutes);
app.use('/', deleteCookieRoutes);



// Error handling middleware
app.use((err, req, res, next) => {
    // Set locals, only providing error details in development
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    const error = req.app.get('env') === 'development' ? err.stack : '';

    // Render the error.ejs template
    res.status(status).render('error', { status, message, error });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
