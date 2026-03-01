// ChatbotPage.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import LanguageIcon from "@mui/icons-material/Language";

// ✅ Import chatbot service
import { askChatbot } from "../../services/chatbot";

// Helper function to render markdown text with proper formatting
const renderMarkdownText = (text) => {
  // Split by newlines and process each line
  return text.split('\n').map((line, lineIdx) => {
    // Check if line starts with a number followed by period (numbered list)
    const numberedListRegex = /^(\d+)\.\s*(.+)$/;
    const match = line.match(numberedListRegex);

    if (match) {
      const [, number, content] = match;
      return (
        <Box key={lineIdx} sx={{ mb: 1, ml: 2 }}>
          <Typography variant="body2" sx={{ display: 'inline' }}>
            <strong>{number}.</strong> {renderInlineMarkdown(content)}
          </Typography>
        </Box>
      );
    }

    // For other lines, render inline markdown
    return (
      <Typography key={lineIdx} variant="body2" sx={{ mb: 1, whiteSpace: 'pre-wrap' }}>
        {renderInlineMarkdown(line)}
      </Typography>
    );
  });
};

// Helper function to render inline markdown (bold, italic, etc.)
const renderInlineMarkdown = (text) => {
  const parts = [];
  let lastIdx = 0;
  const boldRegex = /\*\*(.+?)\*\*/g;
  let match;

  while ((match = boldRegex.exec(text)) !== null) {
    // Push text before match
    if (match.index > lastIdx) {
      parts.push(text.substring(lastIdx, match.index));
    }
    // Push bold text
    parts.push(<strong key={`bold-${match.index}`}>{match[1]}</strong>);
    lastIdx = match.index + match[0].length;
  }

  // Push remaining text
  if (lastIdx < text.length) {
    parts.push(text.substring(lastIdx));
  }

  return parts.length > 0 ? parts : text;
};

const ChatbotPage = () => {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I'm the Charity Connect AI assistant. Ask me anything in English, Urdu, Arabic, or any language...\n\nہیلو! میں Charity Connect کے AI اسسٹنٹ ہوں۔ مجھ سے کوئی بھی سوال کریں اردو میں۔",
    },
  ]);
  const [input, setInput] = useState("");
  const [detectedLanguage, setDetectedLanguage] = useState(null);
  const chatContainerRef = useRef(null);

  // Detect language from input
  const detectLanguageFromInput = (text) => {
    if (!text) return null;
    
    // Urdu script detection
    const urduScriptRegex = /[\u0600-\u06FF]/g;
    if (urduScriptRegex.test(text)) {
      return 'urdu-script';
    }

    // Roman Urdu keywords
    const romanUrduKeywords = ['aur', 'kya', 'kahan', 'kis', 'haan', 'nahi', 'mera', 'tera', 'hota', 'chahta', 'woh', 'yeh'];
    const lowerText = text.toLowerCase();
    const romanUrduCount = romanUrduKeywords.filter(keyword => lowerText.includes(keyword)).length;
    if (romanUrduCount >= 1) {
      return 'urdu-roman';
    }

    return 'english';
  };

  // Get language label
  const getLanguageLabel = (lang) => {
    const labels = {
      'english': '🇬🇧 English',
      'urdu-script': '🇵🇰 اردو',
      'urdu-roman': '🇵🇰 Roman Urdu',
      'arabic': '🇸🇦 العربية',
    };
    return labels[lang] || 'Unknown';
  };

  // ✅ UPDATED HANDLE SEND (LANGUAGE DETECTION)
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    const detectedLang = detectLanguageFromInput(userMessage);
    setDetectedLanguage(detectedLang);

    // Show user message
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setInput("");

    // Typing indicator with language
    setMessages((prev) => [
      ...prev,
      { 
        sender: "bot", 
        text: `Typing...\n(Detected: ${getLanguageLabel(detectedLang)})`,
        isTyping: true 
      }
    ]);

    try {
      const res = await askChatbot(userMessage, "donor");

      setMessages((prev) => [
        ...prev.slice(0, -1),
        { sender: "bot", text: res.data.message, isTyping: false },
      ]);
    } catch (err) {
      console.error("Chatbot error:", err);

      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          sender: "bot",
          text: "Something went wrong. Please try again.",
          isTyping: false
        },
      ]);
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Box
      sx={{
        minHeight: "50vh",
        display: "flex",
        flexDirection: "column",
        mt: "100px",
        px: 2,
      }}
    >
      <Box sx={{ display: "flex", flex: 1 }}>
        {/* SIDEBAR */}
        <Box
          sx={{
            width: "280px",
            bgcolor: "#f2f4f7",
            p: 2,
            borderRadius: "12px",
            boxShadow: "0 3px 12px rgba(0,0,0,0.12)",
            border: "1px solid #d3d7dd",
            height: "440px",
            mr: 2,
            mt: 3,
          }}
        >
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ fontWeight: 600, color: "#333" }}
          >
            Frequently Asked
          </Typography>

          <List sx={{ mb: 2 }}>
            {[
              "Donation process",
              "Story Submission Process",
              "Payment process",
            ].map((item, index) => (
              <ListItem
                button
                key={index}
                sx={{
                  borderRadius: "8px",
                  mb: 1,
                  "&:hover": { bgcolor: "#e6eef7" },
                }}
                onClick={() => setInput(item)}
              >
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />

          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ fontWeight: 600, color: "#333" }}
          >
            Recent Conversation
          </Typography>

          <List>
            {["Donation request help", "How to donate"].map((item, index) => (
              <ListItem
                button
                key={index}
                sx={{
                  borderRadius: "8px",
                  mb: 1,
                  "&:hover": { bgcolor: "#e6eef7" },
                }}
                onClick={() => setInput(item)}
              >
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* CHAT PANEL */}
        <Box sx={{ flex: 1, p: 1.8, display: "flex", flexDirection: "column" }}>
          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 2, justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <img
                src="/assets/chatbot.png"
                alt="Chatbot Logo"
                style={{ width: "40px", height: "40px", marginRight: "10px" }}
              />
              <Typography variant="h6">
                CharityConnect AI Assistant
              </Typography>
            </Box>
            {detectedLanguage && (
              <Chip
                icon={<LanguageIcon />}
                label={getLanguageLabel(detectedLanguage)}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
          </Box>

          {/* Messages */}
          <Paper
            ref={chatContainerRef}
            sx={{
              flex: 1,
              p: 2,
              mb: 2,
              overflowY: "auto",
              maxHeight: "50vh",
            }}
          >
            {messages.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  mb: 2,
                  display: "flex",
                  justifyContent:
                    msg.sender === "user" ? "flex-end" : "flex-start",
                }}
              >
                <Paper
                  sx={{
                    p: 1.5,
                    bgcolor: msg.sender === "user" ? "#4caf50" : msg.isTyping ? "#fff3e0" : "#e0e0e0",
                    color: msg.sender === "user" ? "#fff" : "#000",
                    maxWidth: "70%",
                    fontStyle: msg.isTyping ? "italic" : "normal",
                  }}
                >
                  {msg.sender === "bot" && !msg.isTyping ? renderMarkdownText(msg.text) : msg.text}
                </Paper>
              </Box>
            ))}
          </Paper>

          {/* Input */}
          <Box sx={{ display: "flex" }}>
            <TextField
              fullWidth
              placeholder="Type your message here (English, Urdu, Arabic...) ..."
              variant="outlined"
              size="small"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <Button
              onClick={handleSend}
              sx={{
                ml: 1,
                bgcolor: "#6a1b9a",
                "&:hover": { bgcolor: "#4a146e" },
              }}
              variant="contained"
              endIcon={<SendIcon />}
            >
              SEND
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatbotPage;
