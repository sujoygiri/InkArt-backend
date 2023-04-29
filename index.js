require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');

const requestLogger = require('./util/requestLogger');
const errorLogger = require('./util/errorLogger');
const authRouter = require('./routes/auth.route');

const PORT = 3000;

const app = express();

async function connect() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/', { dbName: 'inkart', useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to database');
    } catch (error) {
        console.log(error);
    }
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    name: '_USID',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000, sameSite: 'strict' },
}));
app.use(requestLogger);

app.use('/auth', authRouter);

app.use(errorLogger);
app.listen(PORT, () => {
    connect();
    console.log(`Server running on port ${PORT}`);
});