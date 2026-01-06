import './globals.css';
import Header from '../components/Header';
import styles from '../components/Layout.module.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className={styles.container}>
            <Header />
            {children}
        </div>
      </body>
    </html>
  );
}
