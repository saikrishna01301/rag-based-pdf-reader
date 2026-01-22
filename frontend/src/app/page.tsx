"use client";
import { useChat } from '../hooks/useChat';
import Sidebar from '../components/Sidebar';
import ChatArea from '../components/ChatArea';
import styles from '../components/Layout.module.css';

export default function Home() {
  const chat = useChat();

  return (
    <>
      <div className={styles.demoBanner}>
        <span className={styles.warningIcon}>⚠️</span>
        <p>
          <strong>Demo Notice:</strong> This is a UI demo only. The backend uses local AI and is not deployed.
          To try the full app, clone the repo and set it up locally.{' '}
          <a
            href="https://github.com/saikrishna488/pdf-reader"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Setup Instructions on GitHub
          </a>
        </p>
      </div>
      <div className={styles.mainLayout}>
        <Sidebar {...chat} />
        <ChatArea {...chat} />
      </div>
    </>
  );
}