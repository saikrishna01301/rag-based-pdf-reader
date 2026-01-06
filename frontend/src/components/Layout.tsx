import Header from './Header';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';
import { useChat } from '../hooks/useChat';
import styles from './Layout.module.css';

const Layout = (props: ReturnType<typeof useChat>) => (
    <div className={styles.container}>
        <Header />
        <div className={styles.mainLayout}>
            <Sidebar {...props} />
            <ChatArea {...props} />
        </div>
    </div>
);

export default Layout;
