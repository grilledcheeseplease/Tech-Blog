const router = require('express').Router();
const { User, Post, Comment } = require('../../models');

// GET all Users
router.get('/', async (req, res) => {
    try {
        const usersData = await User.findAll({ 
            attributes: { 
                exclude: ['password'] 
            }
        });
        res.status(200).json(usersData); 
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET a single User
router.get('/:id', async (req, res) => {
    try {
        const usersData = await User.findByPk(req.params.id, {
            include: [
                {
                    model: Post,
                    attributes: {
                        exclude: ['user_id']
                    }
                },
                {
                    model: Comment,
                    attributes: {
                        exclude: ['post_id', 'user_id']
                    },
                },
            ],
        });
        
        if (!usersData) {
            res.status(404).json({ message: 'No user with this id' });
            return;
        }

        res.json(usersData);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// create User
router.post('/', async (req, res) => {
    try {
        const usersData = await User.create(req.body);

        req.session.save(() => {
            req.session.user_id = usersData.id;
            req.session.username = usersData.username;
            req.session.loggedIn = true;

            res.status(200).json(usersData);
        });
        
    } catch (err) {
        res.status(400).json(err);
    }
});

// User login
router.post('/login', async (req, res) => {
    try {
        const usersData = await User.findOne({ where: { username: req.body.username } });

        if (!usersData) {
            res.status(400).json({ message: 'Incorrect username or password, please try again' });
            return;
        }

        const validPassword = await usersData.checkPassword(req.body.password);

        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect username or password, please try again' });
            return;
        }

        req.session.save(() => {
            req.session.user_id = usersData.id;
            req.session.username = usersData.username;
            req.session.loggedIn = true;

            res.json({ user: usersData, message: 'You are now logged in!' });
        });

    } catch (err) {
        res.status(400).json(err);
    }
});

// User logout
router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

// User update
router.put('/:id', async (req, res) => {
    try {
        const usersData = await User.update(req.body, {
            individualHooks: true,
            where: { id: req.params.id}
        });

        if (!usersData[0]) {
            res.status(404).json({ message: 'No user with this id' });
            return;
        }

        res.status(200).json(usersData);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// User DELETE 
router.delete('/:id', async (req, res) => {
    try {
        const usersData = await User.destroy({
            where: {
                id: req.params.id,
            },
        });

        if (!usersData) {
            res.status(404).json({ message: 'No user with this id' });
            return;
        };

        res.status(200).json(usersData);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
