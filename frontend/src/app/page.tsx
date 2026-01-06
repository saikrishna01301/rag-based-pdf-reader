"use client";
import { useChat } from '../hooks/useChat';
import Sidebar from '../components/Sidebar';
import ChatArea from '../components/ChatArea';
import styles from '../components/Layout.module.css';

export default function Home() {
  const chat = useChat();

  return (
    <div className={styles.mainLayout}>
        <Sidebar {...chat} />
        <ChatArea {...chat} />
    </div>
  );
}