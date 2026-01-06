import { useRef } from 'react';
import { useChat, PDF } from '../hooks/useChat';
import styles from './Sidebar.module.css';

const Sidebar = ({ pdfs, activePdfId, selectPdf, uploadFiles }: ReturnType<typeof useChat>) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            uploadFiles(Array.from(e.target.files));
        }
    };

    return (
        <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
                <h2>Document Library</h2>
            </div>
            
            <div className={styles.sidebarContent}>
                <div 
                    className={styles.uploadZone}
                    onClick={handleUploadClick}
                >
                    <div className={styles.uploadIcon}>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                        </svg>
                    </div>
                    <div className={styles.uploadText}>Upload PDF Documents</div>
                    <div className={styles.uploadHint}>Click or drag files here</div>
                </div>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    accept=".pdf" 
                    multiple 
                    style={{display: 'none'}}
                    onChange={handleFileChange}
                />
                
                <div className={styles.pdfListHeader}>Recent Documents</div>
                <div className={styles.pdfList}>
                    {pdfs.map((pdf: PDF) => (
                        <div 
                            key={pdf.id}
                            className={`${styles.pdfItem} ${activePdfId === pdf.id ? styles.active : ''}`}
                            onClick={() => selectPdf(pdf.id)}
                        >
                            <div className={styles.pdfIcon}>
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                                </svg>
                            </div>
                            <div className={styles.pdfInfo}>
                                <div className={styles.pdfName}>{pdf.name}</div>
                                <div className={styles.pdfChunks}>{pdf.chunks} chunks</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
