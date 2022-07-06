const { Comment } = require('../models');

const commentData = [];

const seedComments = () => User.bulkCreate(commentData);

module.exports = seedComments;