import { useState, useEffect, useRef } from 'react';
import {
  uploadPdf,
  askQuestion,
  listPdfs,
} from '../services/api';

export interface PDF {
  id: string;
  name: string;
  chunks?: number;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: { chunk_id: number; pdf_id: string }[];
}

export const useChat = () => {
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [activePdfId, setActivePdfId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const fetchPdfs = async () => {
    try {
      const pdfsData = await listPdfs();
      setPdfs(pdfsData.pdfs);
    } catch (error) {
      console.error('Failed to fetch PDFs:', error);
    }
  };

  useEffect(() => {
    fetchPdfs();
  }, []);

  const uploadFiles = async (files: File[]) => {
    try {
      for (const file of files) {
        await uploadPdf(file);
      }
      await fetchPdfs();
    } catch (error) {
      console.error('Failed to upload files:', error);
    }
  };

  const sendMessage = async (message: string) => {
    if (!message) return;

    setChatHistory((prev) => [...prev, { role: 'user', content: message }]);
    setIsTyping(true);

    try {
      const sanitizedChatHistory = chatHistory.map(({ role, content }) => ({ role, content }));
      const response = await askQuestion(message, activePdfId, sanitizedChatHistory);
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to read response stream');
      }

      let currentAssistantMessageContent = '';
      let currentAssistantMessageSources: { chunk_id: number; pdf_id: string }[] | undefined = undefined;
      let assistantMessageIndex: number | null = null; // To track the index of the assistant message in chatHistory

      let buffer = '';
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          if (buffer.trim()) {
            try {
              const parsed = JSON.parse(buffer);
              if (parsed.type === 'metadata') {
                currentAssistantMessageSources = parsed.sources;
              } else if (parsed.type === 'chunk') {
                currentAssistantMessageContent += parsed.content;
                if (assistantMessageIndex !== null) {
                  const index = assistantMessageIndex; // TypeScript narrowing
                  setChatHistory((prev) => {
                    const newHistory = [...prev];
                    newHistory[index] = {
                      role: 'assistant',
                      content: currentAssistantMessageContent,
                      sources: currentAssistantMessageSources,
                    };
                    return newHistory;
                  });
                }
              }
            } catch (e) {
              console.error('Failed to parse remaining stream buffer:', buffer, e);
            }
          }
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep the last (potentially incomplete) line in the buffer

        for (const line of lines) {
          if (!line.trim()) continue;

          try {
            const parsed = JSON.parse(line);
            if (parsed.type === 'metadata') {
              currentAssistantMessageSources = parsed.sources;
            } else if (parsed.type === 'chunk') {
              currentAssistantMessageContent += parsed.content;
              if (assistantMessageIndex === null) {
                // First chunk arrived, add assistant message to history
                setChatHistory((prev) => {
                  const newMessage: Message = {
                    role: 'assistant' as const,
                    content: currentAssistantMessageContent,
                    sources: currentAssistantMessageSources,
                  };
                  const newHistory = [...prev, newMessage];
                  assistantMessageIndex = newHistory.length - 1;
                  return newHistory;
                });
              } else {
                // Subsequent chunks, update existing message
                const index = assistantMessageIndex;
                setChatHistory((prev) => {
                  const newHistory = [...prev];
                  newHistory[index] = {
                    role: 'assistant' as const,
                    content: currentAssistantMessageContent,
                    sources: currentAssistantMessageSources,
                  };
                  return newHistory;
                });
              }
            }
          } catch (e) {
            console.error('Failed to parse stream chunk:', line, e);
          }
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      };
      setChatHistory((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const selectPdf = (pdfId: string) => {
    setActivePdfId((prev) => (prev === pdfId ? null : pdfId));
  };

  return {
    pdfs,
    activePdfId,
    chatHistory,
    isTyping,
    uploadFiles,
    sendMessage,
    selectPdf,
  };
};
