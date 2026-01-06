import styles from './Header.module.css';

const Header = () => (
    <header className={styles.header}>
        <h1 className={styles.title}>PDF Intelligence</h1>
        <p className={styles.subtitle}>Upload documents, ask questions, get instant answers</p>
    </header>
);

export default Header;
