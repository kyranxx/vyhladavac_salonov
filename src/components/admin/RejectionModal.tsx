'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import styles from './RejectionModal.module.css';

interface RejectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => Promise<void>;
    salonName: string;
}

export function RejectionModal({ isOpen, onClose, onConfirm, salonName }: RejectionModalProps) {
    const [reason, setReason] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!reason.trim()) return;
        setSubmitting(true);
        try {
            await onConfirm(reason);
            onClose();
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Zamietnuť salón: ${salonName}`}
            footer={
                <>
                    <button
                        onClick={onClose}
                        disabled={submitting}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '0.5rem',
                            border: '1px solid var(--border)',
                            background: 'transparent',
                            cursor: 'pointer'
                        }}
                    >
                        Zrušiť
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting || !reason.trim()}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '0.5rem',
                            border: 'none',
                            background: 'var(--error)',
                            color: 'white',
                            cursor: 'pointer',
                            opacity: (submitting || !reason.trim()) ? 0.7 : 1
                        }}
                    >
                        {submitting ? 'Zamietam...' : 'Zamietnuť'}
                    </button>
                </>
            }
        >
            <div className={styles.warning}>
                ⚠ Táto akcia odošle majiteľovi email o zamietnutí.
            </div>
            <p className={styles.info}>Uveďte dôvod zamietnutia, aby majiteľ vedel, čo má opraviť.</p>
            <textarea
                className={styles.textarea}
                placeholder="Dôvod zamietnutia..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                autoFocus
            />
        </Modal>
    );
}
