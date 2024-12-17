const express = require('express');
const session = require('express-session'); 
const path = require('path');
const hostRoutes = require('./routes/hostRoutes');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const registerRoutes = require('./routes/registerRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const deleteCookieRoutes = require('./routes/deleteCookieRoutes');
const {auth, server} = require('./config/env');
const { logger } = require('./utils/logger');
const { getAttendanceState } = require('./states/attendanceState');
const { getRegistrationState } = require('./states/registerState');
const { getDomain, getBaseURL } = require('./states/general');
const FileStore = require('session-file-store')(session);


const PORT = server.port;
// Get the Domain (Ip address)
const DOMAIN = server.domain || getDomain();

const app = express();

// Middleware setup
app.use(express.json());

// Middleware to parse form data (application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// Cookie Parser middleware
app.use(cookieParser(auth.secretKey));

// Session middleware
app.use(session({
    secret: auth.secretKey,      // Secret key for signing the cookie
    resave: false,               // Prevent resaving unmodified sessions
    saveUninitialized: true,     // Save new, empty sessions
    cookie: { maxAge: 31104000000 },  // Session expires in 1 year
    store: new FileStore({
        path: './sessions',  // Directory to store session files
        ttl: 31536000000,    // Time-to-live for each session in milliseconds (1 year)
        retries: 0,          // Number of retries to access the file store
        cleanupInterval: 86400  // Cleanup interval (every 24 hours)
    })
}));

// Static files (e.g., images, styles)
app.use(express.static(path.join(__dirname, '../public/static')));

// Set 'views' directory for any views being rendered
app.set('views', path.join(__dirname, 'views'));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Redirect to /host
app.get('/', (req, res) => {
    logger.info('GET /');
    res.redirect('/host');
});

// Use the route handlers
app.use('/host', hostRoutes);
app.use('/', attendanceRoutes);
app.use('/', registerRoutes);
// app.use('/', deleteCookieRoutes);



// Error handling middleware
app.use((err, req, res, next) => {
    // Check if headers have already been sent
    if (res.headersSent) {
        return next(err); // Delegate to the default error handler
    }
    
    // Set locals, only providing error details in development
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    const error = req.app.get('env') === 'development' ? err.stack : '';
    logger.error(`Error: ${message}`);
    
    // Render the error.ejs template
    res.status(status).render('error', { status, message});
});


app.listen(PORT, '0.0.0.0', () => {
    logger.info(`Server running on `+getBaseURL());
});
