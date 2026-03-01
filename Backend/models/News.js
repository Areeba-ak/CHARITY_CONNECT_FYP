const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    imageUrl: String,
    publishedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('News', newsSchema);
