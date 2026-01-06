import { useState, useEffect, useRef } from 'react';

export interface PDF {
  id: string;
  name: string;
  chunks: number;
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

  const uploadFiles = async (files: File[]) => {
    for (const file of files) {
      const newPdf: PDF = {
        id: 'pdf_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        name: file.name,
        chunks: Math.floor(Math.random() * 50) + 10,
      };
      setPdfs((prevPdfs) => [...prevPdfs, newPdf]);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  };

  const sendMessage = async (message: string) => {
    if (!message) return;

    setChatHistory((prev) => [...prev, { role: 'user', content: message }]);
    setIsTyping(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const response: Message = {
      role: 'assistant',
      content: activePdfId
        ? `Based on the PDF "${pdfs.find((p) => p.id === activePdfId)?.name}", here's the answer: This is a mock response. In production, this would stream from your /ask endpoint.`
        : `This is a general AI response to: "${message}". Since no PDF is selected, I'm responding with general knowledge.`,
      sources: activePdfId ? [{ chunk_id: 0, pdf_id: activePdfId }] : null,
    };

    setIsTyping(false);
    setChatHistory((prev) => [...prev, response]);
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
