const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
    db.query('SELECT * FROM posts', (err, results) => {
        if (err) throw err;
        res.render('index', { posts: results });
    });
});

module.exports = router;

