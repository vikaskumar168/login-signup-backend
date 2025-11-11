const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());


// health check
app.get('/', (req, res) => res.status(200).json({ status: 'ok' , message : 'Welcome to the Auth API'}));


app.use((err,req,res,next) => {
    console.error(err);
    res.status(500).json({error:'Internal Server Error'});
});

module.exports = app;