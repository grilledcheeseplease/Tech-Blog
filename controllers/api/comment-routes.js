const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// GET all Comments
router.get('/', async (req, res) => {
    try {
        const commentData = await Comment.findAll({});
        res.status(200).json(commentData);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// GET a single Comment
router.get('/:id', async (req, res) => {
    try {
        const commentData = await Comment.findByPk(req.params.id);
        res.status(200).json(commentData);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// create Comment
router.post('/', withAuth, async (req, res) => {
    try {
        const commentData = await Comment.create({
            date_created: req.body.date_created,
            content: req.body.content,
            post_id: req.body.post_id,
            user_id: req.session.user_id
        });

        res.status(200).json(postData);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

// update Comment
router.put('/:id', withAuth, async (req, res) => {
    try {
        const commentData = await Comment.update(req.params.id, {
            content: req.body.content
        });

        if (!commentData) {
            res.status(404).json({ message: 'No comment with this id' });
            return;
        }

        res.status(200).json(postData);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// DELETE Comment
router.delete('/:id', withAuth, async (req, res) => {
    try {
        const commentData = await Comment.destroy({ where: req.params.id });

        if (!commentData) {
            res.status(404).json({ message: 'No comment with this id' });
            return;
        }

        res.status(200).json(postData);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;