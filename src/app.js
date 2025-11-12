const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// simple request logger to help debug incoming requests (remove in production)
app.use((req, res, next) => {
    console.log(`[req] ${req.method} ${req.originalUrl} - ip:${req.ip}`);
    next();
});


// health check
app.get('/', (req, res) => res.status(200).json({ status: 'ok' , message : 'Welcome to the Auth API'}));

const authRoutes = require('./routes/auth.routes');
app.use('/auth', authRoutes);

app.use((err,req,res,next) => {
    console.error(err);
    res.status(500).json({error:'Internal Server Error'});
});

module.exports = app;