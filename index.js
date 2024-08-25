const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const db = require('./db');

const app = express();

// Middleware
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'your secret',
    resave: false,
    saveUninitialized: true
}));

// Middleware to set userId
app.use((req, res, next) => {
    res.locals.userId = req.session.userId || null;
    next();
});

// Routes
const indexRoutes = require('./routes/index');
const postRoutes = require('./routes/post');
const authRoutes = require('./routes/auth');

app.use('/', indexRoutes);
app.use('/post', postRoutes);
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
