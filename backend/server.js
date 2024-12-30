const express = require('express');
const session = require('express-session'); 
const path = require('path');
const hostRoutes = require('./routes/hostRoutes');
const cookieParser = require('cookie-parser');
const registerRoutes = require('./routes/registerRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const { auth, server } = require('./config/env');
const { logger } = require('./utils/logger');
const {getBaseURL } = require('./states/general');
const FileStore = require('session-file-store')(session);
const cors = require('cors');
const http = require("http");
const { initSocket } = require('./utils/socketHelper');
const AppError = require('./utils/AppError');
const errorHandler = require('./middleware/errorHandler');

const PORT = server.port;
// Get the Domain (Ip address)
const DOMAIN = getBaseURL();

const app = express();
const appServer = http.createServer(app); // Create HTTP appServer
// Initialize Socket.IO
initSocket(appServer);

// Middleware setup
app.use(express.json());

// Middleware to parse form data (application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// Cookie Parser middleware
app.use(cookieParser(auth.secretKey));


const corsOptions = {
    origin: 'http://localhost:5173', // Frontend origin
    credentials: true, // Allow cookies and credentials
  };

app.use(cors(corsOptions));

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
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Register Route
app.use('/',registerRoutes)

// Redirect to /host
app.get('*', (req, res) => {
    logger.info('Sending React App');
    const reactPath = path.join(__dirname, '../frontend/dist/index.html');
    return res.sendFile(reactPath);
});


// Catch-all route for undefined endpoints
app.all('*', (req, res, next) => {
    next(new AppError(40401));
  });

// Error handling middleware
app.use(errorHandler);


appServer.listen(PORT, '0.0.0.0', () => {
    logger.info(`Server running on ` + DOMAIN);
});
