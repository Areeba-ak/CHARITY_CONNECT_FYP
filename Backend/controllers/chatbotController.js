require('dotenv').config();
const ChatLog = require('../models/chatLogModel');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Load SRS Summary
const SUMMARY = fs.readFileSync(
  path.join(__dirname, 'prompts', 'CharityConnect_SRS_Summary.txt'),
  'utf-8'
);

// Detect language from query
const detectLanguage = (query = '') => {
  if (!query) return 'english';

  // Urdu script detection (unicodes: 0600-06FF)
  const urduScriptRegex = /[\u0600-\u06FF]/g;
  if (urduScriptRegex.test(query)) {
    return 'urdu-script';
  }

  // Roman Urdu keywords
  const romanUrduKeywords = ['aur', 'kya', 'kahan', 'kis', 'haan', 'nahi', 'mera', 'tera', 'hota', 'raha', 'dono', 'iska', 'jo', 'jo', 'waisay', 'lekin'];
  const lowerQuery = query.toLowerCase();
  const romanUrduCount = romanUrduKeywords.filter(keyword => lowerQuery.includes(keyword)).length;
  if (romanUrduCount >= 2) {
    return 'urdu-roman';
  }

  // Arabic script detection
  const arabicRegex = /[\u0600-\u06FF]/g;
  if (arabicRegex.test(query)) {
    return 'arabic';
  }

  // Check for common Urdu words in Roman script
  if (lowerQuery.includes('salaam') || lowerQuery.includes('kaise') || lowerQuery.includes('kitna')) {
    return 'urdu-roman';
  }

  return 'english';
};

// Detect category from query
const detectCategoryHint = (query = '') => {
  const lower = query.toLowerCase();

  if (lower.includes('clothes') || lower.includes('kapray') || lower.includes('kapre')) {
    return '\nNote: The user is asking about clothes. Please clarify that donations in this category are made through **money only**, not physical clothes.';
  }

  if (lower.includes('books') || lower.includes('kitaben') || lower.includes('kitaab')) {
    return '\nNote: The user is asking about books. Please clarify that donations are done **monetarily**, not by sending physical books.';
  }

  if (lower.includes('food') || lower.includes('khana') || lower.includes('khanay')) {
    return '\nNote: The user is asking about food. Please clarify that only **monetary donations** are currently accepted.';
  }

  if (lower.includes('medicine') || lower.includes('dawa') || lower.includes('medicin')) {
    return '\nNote: The user is asking about medical aid. Please clarify that support is given through **financial contributions only**.';
  }

  return '';
};

// System prompt builder with explicit language instruction
const getSystemPromptByRole = (role = 'default', query = '', detectedLanguage = 'english') => {
  const languageInstructions = {
    'urdu-script': 'اگر صارف اردو میں پوچھ رہا ہے تو اپنا جواب صرف اردو میں دیں۔ ہمیشہ صارف کی زبان میں جواب دیں۔',
    'urdu-roman': 'Agar user Roman Urdu main pooch raha hai to apka jawab Roman Urdu mein hi den. Hamesha user ki zaban main jawab den.',
    'arabic': 'إذا كان المستخدم يسأل بالعربية، فيرجى الرد باللغة العربية فقط. اجب دائمًا بلغة المستخدم.',
    'english': 'If the user is asking in English, respond only in English. Always answer in the user\'s language.'
  };

  const langInstruction = languageInstructions[detectedLanguage] || languageInstructions.english;

  const headers = {
    admin: `You are a helpful assistant for Charity Connect Admins.
You guide them on verifying donation stories, managing users, and monitoring platform activity.

CRITICAL LANGUAGE INSTRUCTION: ${langInstruction}
You can understand and respond in English, Urdu (script: ہے), Roman Urdu (like: hai, chahta, woh), Arabic, and more.
MOST IMPORTANT: Respond ONLY in the language the user used. Do NOT translate.`,

    donor: `You are a helpful assistant for Charity Connect Donors.
You help them browse verified stories and make **secure monetary donations**.
Even if stories request items like books or clothes, donors can only contribute through **money** at this time.

CRITICAL LANGUAGE INSTRUCTION: ${langInstruction}
You can understand and respond in English, Urdu (script: ہے), Roman Urdu (like: hai, chahta, woh), Arabic, and more.
MOST IMPORTANT: Respond ONLY in the language the user used. Do NOT translate.`,

    beneficiary: `You are a helpful assistant for Charity Connect Beneficiaries.
You assist them in submitting donation stories, checking verification status, and understanding how the system works.

CRITICAL LANGUAGE INSTRUCTION: ${langInstruction}
You can understand and respond in English, Urdu (script: ہے), Roman Urdu (like: hai, chahta, woh), Arabic, and more.
MOST IMPORTANT: Respond ONLY in the language the user used. Do NOT translate.`,

    'default': `You are a helpful assistant for Charity Connect users.

CRITICAL LANGUAGE INSTRUCTION: ${langInstruction}
You can understand and respond in English, Urdu (script: ہے), Roman Urdu (like: hai, chahta, woh), Arabic, and more.
MOST IMPORTANT: Respond ONLY in the language the user used. Do NOT translate.`
  };

  const header = headers[role] || headers['default'];
  const categoryHint = detectCategoryHint(query);
  return header + categoryHint + '\n' + SUMMARY;
};

// Model request
const sendToModel = async (model, query, systemPrompt) => {
  const response = await axios.post(
    OPENROUTER_API_URL,
    {
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: query }
      ],
      max_tokens: 500
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data.choices[0].message.content.trim();
};

// Main chatbot controller
exports.getHelp = async (req, res) => {
  const { query } = req.body;

  // Use role from authenticated user if available, else default
  const role = req.user?.role || req.body.role || 'default';

  if (!query) {
    return res.status(400).json({ error: 'Query is required.' });
  }

  // Detect language from the query
  const detectedLanguage = detectLanguage(query);

  const systemPrompt = getSystemPromptByRole(role, query, detectedLanguage);
  let modelUsed = 'openai/gpt-4o-mini';

  try {
    // Primary model with language-aware system prompt
    let answer = await sendToModel('openai/gpt-4o-mini', query, systemPrompt);

    // Fallback if response is weak
    if (
      answer.length < 40 ||
      answer.toLowerCase().includes("i'm not sure") ||
      (answer.toLowerCase().includes("please contact") && detectedLanguage === 'english')
    ) {
      answer = await sendToModel('openai/gpt-4-1106-preview', query, systemPrompt);
      modelUsed = 'gpt-4.1';
    }

    // Save conversation to DB with detected language
    await ChatLog.create({
      role,
      query,
      response: answer,
      modelUsed,
      detectedLanguage
    });

    res.json({ message: answer });

  } catch (error) {
    console.error("Chatbot error:", error.response?.data || error.message);
    res.status(500).json({
      error: error.response?.data?.error?.message || "An error occurred while generating a response."
    });
  }
};
