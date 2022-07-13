const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

// variable for data serialization
const serialize = (data) => JSON.parse(JSON.stringify(data));

// GET all Posts for dashboard
router.get('/', withAuth, async (req, res) => {
    try {
        const postsData = await Post.findAll({
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

        const posts = serialize(postsData);
        res.render('dashboard', { posts, loggedIn: true });

    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// edit Post
router.get('/edit/:id', withAuth, async (req, res) => {
    try {
        const postsData = await Post.findByPk(req.params.id, {
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

        if (!postsData) {
            res.status(404).json({ message: 'No post with this id' });
            return;
        }

        const post = postsData.get({ plain: true });
        res.render('edit-post', { post, loggedIn: true });

    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// created posts on dashboard
router.get('/create', withAuth, async (req, res) => {
    try {
      return res.render('new-post', { loggedIn: req.session.loggedIn });
        
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
});

module.exports = router;