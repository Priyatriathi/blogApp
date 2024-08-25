const express = require('express');
const router = express.Router();
const db = require('../db');

// Render form for new post
router.get('/new', isLoggedIn, (req, res) => {
    res.render('new-post');
});

// Handle submission of new post
router.post('/new', isLoggedIn, (req, res) => {
    const { title, content } = req.body;
    const author_id = req.session.userId;
    db.query('INSERT INTO posts (title, content, author_id) VALUES (?, ?, ?)', [title, content, author_id], (err, results) => {
        if (err) throw err;
        res.redirect('/');
    });
});
// View a specific post
router.get('/:id', (req, res) => {
    const postId = req.params.id;
    db.query('SELECT * FROM posts WHERE id = ?', [postId], (err, result) => {
        if (err) {
            // Handle database error
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        
        if (result.length === 0) {
            // No post found with the given ID
            res.status(404).send('Post not found');
            return;
        }
        
        // Render the post.ejs view with the first (and only) element of the result array
        res.render('post', { post: result[0] });
    });
});


// Delete a specific post
router.post('/:id/delete', isLoggedIn, (req, res) => {
    const postId = req.params.id;
    const userId = req.session.userId;

    // Check if the logged-in user is the author of the post
    db.query('SELECT author_id FROM posts WHERE id = ?', [postId], (err, result) => {
        if (err) throw err;
        
        if (result.length > 0 && result[0].author_id === userId) {
            db.query('DELETE FROM posts WHERE id = ?', [postId], (err, result) => {
                if (err) throw err;
                res.redirect('/');
            });
        } else {
            res.status(403).send('Unauthorized to delete this post.');
        }
    });
});

// Middleware to check if user is logged in
function isLoggedIn(req, res, next) {
    if (req.session.userId) {
        next();
    } else {
        res.redirect('/auth/login');
    }
}

module.exports = router;
