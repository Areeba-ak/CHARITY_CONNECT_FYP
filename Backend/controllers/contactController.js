const Contact = require('../models/Contact');

exports.submitContact = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const contact = await Contact.create({ name, email, message });
        res.status(201).json({ message: 'Message received', data: contact });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getContacts = async (req, res) => {
    try {
        const messages = await Contact.find().sort({ submittedAt: -1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
