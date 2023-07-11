const mongoose = require('mongoose');

const Link = mongoose.model('Link', {
    title: String,
    url: String,
});

module.exports = Link