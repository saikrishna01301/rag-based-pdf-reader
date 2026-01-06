import { useState, useRef, useEffect } from 'react';
import { useChat, Message } from '../hooks/useChat';
import styles from './ChatArea.module.css';

const ChatArea = ({
  chatHistory,
  isTyping,
  sendMessage,
  activePdfId,
  pdfs,
}: ReturnType<typeof useChat>) => {
  const [message, setMessage] = useState('');
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chatHistory, isTyping]);

  const handleSendMessage = () => {
    sendMessage(message);
    setMessage('');
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  }

  const getModeText = () => {
    if (activePdfId) {
      const pdf = pdfs.find((p) => p.id === activePdfId);
      return pdf ? `PDF: ${pdf.name.substring(0, 15)}...` : 'General AI';
    } else if (pdfs.length > 0) {
      return `All PDFs (${pdfs.length})`;
    } else {
      return 'General AI';
    }
  };

  return (
    <main className={styles.chatArea}>
      <div className={styles.chatHeader}>
        <div className={styles.chatTitle}>AI Assistant</div>
        <div className={styles.modeIndicator}>
          <div className={styles.modeDot}></div>
          <span>{getModeText()}</span>
        </div>
      </div>

      <div className={styles.chatMessages} ref={chatMessagesRef}>
        {chatHistory.length === 0 && !isTyping ? (
          <div className={styles.emptyState}>
            <svg
              className={styles.emptyIcon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <div className={styles.emptyText}>Start a conversation</div>
            <div className={styles.emptyHint}>
              Upload PDF documents and ask questions, or have a general conversation with the AI assistant
            </div>
          </div>
        ) : (
          chatHistory.map((msg: Message, index: number) => (
            <div key={index} className={`${styles.message} ${msg.role === 'user' ? styles.user : styles.assistant}`}>
              <div
                className={styles.messageAvatar}
              >
                {msg.role === 'user' ? (
                  'U'
                ) : (
                  'AI'
                )}
              </div>
              <div
                className={styles.messageContent}
              >
                <p>{msg.content}</p>
                {msg.sources && msg.sources.length > 0 && msg.sources[0] && (
                  <div className={styles.sourceTag}>
                    Source: Chunk {msg.sources[0].chunk_id}
                  </div>
                )}
                {msg.role === 'assistant' && index === chatHistory.length - 1 && isTyping && msg.content.length === 0 && (
                  <div className={styles.typingIndicator}>
                      <div className={styles.typingDot}></div>
                      <div className={styles.typingDot}></div>
                      <div className={styles.typingDot}></div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className={styles.chatInputArea}>
        <div className={styles.inputWrapper}>
          <div className={styles.inputContainer}>
            <textarea
              ref={textareaRef}
              className={styles.messageInput}
              placeholder="Ask about your PDFs or anything else..."
              rows={1}
              value={message}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            ></textarea>
          </div>
          <button
            className={styles.sendButton}
            onClick={handleSendMessage}
            disabled={!message.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
};

export default ChatArea;
