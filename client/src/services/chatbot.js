import api from "../utils/api";

export const askChatbot = (query, role = "default") => {
  return api.post("/chatbot/assist", { query, role });
};