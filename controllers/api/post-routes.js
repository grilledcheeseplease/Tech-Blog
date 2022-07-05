const router = require('express').Router();
const { Post } = require('../../models');
const withAuth = require('../../utils/auth');

// GET all Posts
router.get('/', async (req, res) => {
    console.log(req.body);

    try {
        const postData = await Post.findAll({
            attributes: { exclude: ['user_id'] },
            order: [['date_created', 'DESC']],
            include: [
                {
                    model: User,
                    attributes: ['username']
                },
                {
                    model: Comment,
                    include: { User, attributes: ['username'] }
                },
            ]
        });

        res.status(200).json(postData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET a single Post
router.get('/:id', async (req, res) => {
    try {
        const postData = await Post.findByPk(req.params.id, {
            attributes: { exclude: ['user_id'] },
            include: [
                {
                    model: User,
                    attributes: ['username']
                },
                {
                    model: Comment,
                    include: { User, attributes: ['username'] }
                },
            ]
        });

        if (!postData) {
            res.status(404).json({ message: 'No post with this id' });
            return;
        }

        res.status(200).json(postData);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// create Post
router.post('/', withAuth, async (req, res) => {
    try {
        const postData = await Post.create(
            {
                title: req.body.title,
                date_created: req.body.date_created,
                content: req.body.content,
                user_id: req.session.user_id
            }
        );

        res.status(200).json(postData);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

// update Post
router.put('/:id', withAuth, async (req, res) => {
    try {
        const postData = await Post.update(
            {
                title: req.body.title,
                content: req.body.content
            },
            {
                where: { id: req.params.id }
            }
        );

        if (!postData) {
            res.status(404).json({ message: 'No post with this id' });
            return;
        }

        res.status(200).json(postData);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// DELETE Post
router.delete('/:id', withAuth, async (req, res) => {
    try {
        const postData = await Post.destroy(
            {
                where: { id: req.params.id }
            }
        );

        if (!postData) {
            res.status(404).json({ message: 'No post with this id' });
            return;
        }

        res.status(200).json(postData);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;