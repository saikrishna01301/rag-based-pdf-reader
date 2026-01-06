const PDF_QA_API_URL = "http://localhost:9000";

export const uploadPdf = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${PDF_QA_API_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload PDF");
  }

  return response.json();
};

export const askQuestion = async (
  question: string,
  pdfId: string | null,
  chatHistory: any[]
) => {
  const response = await fetch(`${PDF_QA_API_URL}/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question,
      pdf_id: pdfId,
      chat_history: chatHistory,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to ask question");
  }

  return response;
};

export const listPdfs = async () => {
  const response = await fetch(`${PDF_QA_API_URL}/pdfs`);

  if (!response.ok) {
    throw new Error("Failed to list PDFs");
  }

  return response.json();
};

export const getChunk = async (pdfId: string, chunkId: number) => {
  const response = await fetch(`${PDF_QA_API_URL}/pdfs/${pdfId}/chunks/${chunkId}`);

  if (!response.ok) {
    throw new Error("Failed to get chunk");
  }

  return response.json();
};