const mongoose = require('mongoose');

const chatLogSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['admin', 'donor', 'beneficiary', 'default'],
      default: 'default'
    },
    query: {
      type: String,
      required: true
    },
    response: {
      type: String,
      required: true
    },
    modelUsed: {
      type: String
    },
    detectedLanguage: {
      type: String,
      enum: ['english', 'urdu-script', 'urdu-roman', 'arabic', 'other'],
      default: 'english'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('ChatLog', chatLogSchema);
