const router = require('express').Router();
const sequelize = require('../config/connection');
const { User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth');

// variable for data serialization
const serialize = (data) => JSON.parse(JSON.stringify(data));

// GET all posts for homepage
router.get('/', async (req, res) => {
    try {
        const postsData = await Post.findAll({
            attributes: {exclude: ['user_id']},
            include: [
                {
                    model: Comment,
                    include: {
                        model: User,
                        attributes: ['username']
                    }
                },
                {
                    model: User,
                    attributes: ['username']
                }
            ]
        });

        const posts = serialize(postsData);
        res.render('homepage', { posts, loggedIn: req.session.loggedIn });

    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// User login
router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/homepage');
        return;
    }
    res.render('login');
});

// GET a single Post
router.get('/:id', withAuth, async (req, res) => {
    try {
        const postsData = await Post.findByPk(req.params.id, {
            attributes: {exclude: ['user_id']},
            include: [
                {
                    model: Comment,
                    include: {
                        model: User,
                        attributes: ['username'] 
                    }
                },
                {
                    model: User,
                    attributes: ['username']
                }
            ]
        });

        if (!postsData) {
            res.status(404).json({ message: 'No post with this id' });
            return;
        }

        const post = serialize(postsData);
        res.render('single-post', { post, loggedIn: req.session.loggedIn });

    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;