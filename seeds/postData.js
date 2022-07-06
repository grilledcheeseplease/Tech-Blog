const { Post } = require('../models');

const postData = [];

const seedPosts = () => User.bulkCreate(postData);

module.exports = seedPosts;