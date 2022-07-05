const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

// variable for data serialization
const serialize = (data) => JSON.parse(JSON.stringify(data));

// GET all Posts for dashboard
router.get('/', withAuth, async (req, res) => {
    try {
        const postData = await Post.findAll({ 
            where: { 
                user_id: req.session.user_id 
            },
            attributes: {
                exclude: ['user_id']
            },
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

        const posts = serialize(postData);
        res.render('dashboard', { posts, loggedIn: true });

    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// edit Post
router.get('/edit/:id', withAuth, async (req, res) => {
    try {
        const postData = await Post.findByPk(req.params.id, {
            attributes: {
                exclude: ['user_id']
            },
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

        if (!postData) {
            res.status(404).json({ message: 'No post with this id' });
            return;
        }

        const post = serialize(postData);
        res.render('edit-post', { post, loggedIn: true });

    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// created Post for dashboard
router.get('/create/', withAuth, async (req, res) => {
    try {
        const postData = await Post.findAll({
            where: { user_id: req.session.user_id },
            attributes: {
                exclude: ['user_id']
            },
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

        const posts = serialize(postData);
        res.render('create-post', { posts, loggedIn: true });

    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;