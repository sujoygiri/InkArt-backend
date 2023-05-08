require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const requestLogger = require('./util/requestLogger');
const errorLogger = require('./util/errorLogger');
const authRouter = require('./routes/auth.route');

const PORT = 3000;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/', { dbName: 'inkart', useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('Connected to database');
}).catch((error) => {
    console.log(error);
});

app.use(cors({origin: 'http://localhost:4200', credentials: true}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    name: '_USID',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000, sameSite: 'strict', httpOnly: true },
    store: MongoStore.create({
        client: mongoose.connection.getClient(),
        dbName: 'inkart',
        collectionName: 'sessions',
        autoRemove: 'native',
    })
}));
app.use(requestLogger);

app.use('/api/auth', authRouter);

app.use(errorLogger);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});