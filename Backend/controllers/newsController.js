const News = require('../models/News');

exports.createNews = async (req, res) => {
    try {
        const { title, content, imageUrl } = req.body;
        const news = await News.create({ title, content, imageUrl });
        res.status(201).json(news);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAllNews = async (req, res) => {
    try {
        const news = await News.find().sort({ publishedAt: -1 });
        res.json(news);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
