const express = require('express');
const cookieParser = require('cookie-parser');
const registerRoutes = require('./routes/registerRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const { PORT, log, green } = require('./config/env');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

app.use('/register', registerRoutes);
app.use('/attendance', attendanceRoutes);

app.listen(PORT, () => {
    log(green, `Server is running on http://localhost:${PORT}`);
});