'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';
import { useToast } from '@/components/ui/Toast';
import styles from './page.module.css';

interface Salon {
    id: string;
    display_id: number;
    name: string;
    city: string;
    status: string;
}

interface Company {
    id: string;
    display_id: number;
    name: string;
    ico: string;
    dic: string;
    ic_dph: string;
    address: string;
    city: string;
    postal_code: string;
    email: string;
    phone: string;
    bank_account: string;
    salons?: Salon[];
}

export default function CompaniesPage() {
    const { user } = useAuth();
    const toast = useToast();
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingCompany, setEditingCompany] = useState<Company | null>(null);
    const [saving, setSaving] = useState(false);
    const [expandedCompanies, setExpandedCompanies] = useState<Set<string>>(new Set());

    const [formData, setFormData] = useState({
        name: '',
        ico: '',
        dic: '',
        ic_dph: '',
        address: '',
        city: '',
        postal_code: '',
        email: '',
        phone: '',
        bank_account: ''
    });

    useEffect(() => {
        if (user) {
            loadCompanies();
        }
    }, [user]);

    const loadCompanies = async () => {
        const supabase = createBrowserSupabaseClient();
        if (!supabase || !user) return;

        try {
            const { data, error } = await supabase
                .from('companies')
                .select('*, salons(id, display_id, name, city, status)')
                .eq('owner_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setCompanies(data || []);
        } catch (error) {
            console.error('Error loading companies:', error);
            toast.error('Nepodarilo sa načítať firmy');
        } finally {
            setLoading(false);
        }
    };

    const toggleExpand = (companyId: string) => {
        setExpandedCompanies(prev => {
            const newSet = new Set(prev);
            if (newSet.has(companyId)) {
                newSet.delete(companyId);
            } else {
                newSet.add(companyId);
            }
            return newSet;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const supabase = createBrowserSupabaseClient();
        if (!supabase || !user) return;

        try {
            if (editingCompany) {
                const { error } = await supabase
                    .from('companies')
                    .update(formData)
                    .eq('id', editingCompany.id);

                if (error) throw error;
                toast.success('Firma bola aktualizovaná');
            } else {
                const { error } = await supabase
                    .from('companies')
                    .insert({
                        ...formData,
                        owner_id: user.id
                    });

                if (error) throw error;
                toast.success('Firma bola vytvorená');
            }

            resetForm();
            loadCompanies();
        } catch (error) {
            console.error('Error saving company:', error);
            toast.error('Nepodarilo sa uložiť firmu');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (company: Company) => {
        setFormData({
            name: company.name || '',
            ico: company.ico || '',
            dic: company.dic || '',
            ic_dph: company.ic_dph || '',
            address: company.address || '',
            city: company.city || '',
            postal_code: company.postal_code || '',
            email: company.email || '',
            phone: company.phone || '',
            bank_account: company.bank_account || ''
        });
        setEditingCompany(company);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Naozaj chcete zmazať túto firmu? Salóny patriace k tejto firme zostanú bez firmy.')) {
            return;
        }

        const supabase = createBrowserSupabaseClient();
        if (!supabase) return;

        try {
            const { error } = await supabase
                .from('companies')
                .delete()
                .eq('id', id);

            if (error) throw error;
            toast.success('Firma bola zmazaná');
            loadCompanies();
        } catch (error) {
            console.error('Error deleting company:', error);
            toast.error('Nepodarilo sa zmazať firmu');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            ico: '',
            dic: '',
            ic_dph: '',
            address: '',
            city: '',
            postal_code: '',
            email: '',
            phone: '',
            bank_account: ''
        });
        setEditingCompany(null);
        setShowForm(false);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <span className={styles.badgeApproved}>Schválený</span>;
            case 'pending':
                return <span className={styles.badgePending}>Čaká</span>;
            case 'rejected':
                return <span className={styles.badgeRejected}>Zamietnutý</span>;
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Načítavam...</div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Moje firmy</h1>
                    <p className={styles.subtitle}>Správa fakturačných údajov pre vaše salóny</p>
                </div>
                {!showForm && (
                    <button onClick={() => setShowForm(true)} className={styles.addButton}>
                        + Pridať firmu
                    </button>
                )}
            </div>

            {showForm && (
                <div className={styles.formCard}>
                    <h2 className={styles.formTitle}>
                        {editingCompany ? 'Upraviť firmu' : 'Nová firma'}
                    </h2>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label>Názov firmy *</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                placeholder="Názov vašej firmy"
                            />
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>IČO</label>
                                <input
                                    type="text"
                                    value={formData.ico}
                                    onChange={(e) => setFormData({ ...formData, ico: e.target.value })}
                                    placeholder="12345678"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>DIČ</label>
                                <input
                                    type="text"
                                    value={formData.dic}
                                    onChange={(e) => setFormData({ ...formData, dic: e.target.value })}
                                    placeholder="2012345678"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>IČ DPH</label>
                                <input
                                    type="text"
                                    value={formData.ic_dph}
                                    onChange={(e) => setFormData({ ...formData, ic_dph: e.target.value })}
                                    placeholder="SK2012345678"
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Adresa sídla</label>
                            <input
                                type="text"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                placeholder="Ulica a číslo"
                            />
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Mesto</label>
                                <input
                                    type="text"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    placeholder="Bratislava"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>PSČ</label>
                                <input
                                    type="text"
                                    value={formData.postal_code}
                                    onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                                    placeholder="81101"
                                />
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="fakturacia@firma.sk"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Telefón</label>
                                <input
                                    type="text"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+421 900 000 000"
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>IBAN (bankový účet)</label>
                            <input
                                type="text"
                                value={formData.bank_account}
                                onChange={(e) => setFormData({ ...formData, bank_account: e.target.value })}
                                placeholder="SK00 0000 0000 0000 0000 0000"
                            />
                        </div>

                        <div className={styles.formActions}>
                            <button type="button" onClick={resetForm} className={styles.cancelButton}>
                                Zrušiť
                            </button>
                            <button type="submit" className={styles.saveButton} disabled={saving}>
                                {saving ? 'Ukladám...' : editingCompany ? 'Uložiť zmeny' : 'Vytvoriť firmu'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {companies.length === 0 && !showForm ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
                        </svg>
                    </div>
                    <h3>Zatiaľ nemáte žiadnu firmu</h3>
                    <p>Vytvorte firmu pre fakturačné údaje vašich salónov</p>
                    <button onClick={() => setShowForm(true)} className={styles.addButton}>
                        + Pridať firmu
                    </button>
                </div>
            ) : (
                <div className={styles.companiesList}>
                    {companies.map((company) => (
                        <div key={company.id} className={styles.companyCard}>
                            <div className={styles.companyHeader}>
                                <div className={styles.companyInfo}>
                                    <span className={styles.companyId}>ID: {company.display_id}</span>
                                    <h3 className={styles.companyName}>{company.name}</h3>
                                </div>
                                <div className={styles.companyActions}>
                                    <button onClick={() => handleEdit(company)} className={styles.editBtn}>
                                        Upraviť
                                    </button>
                                    <button onClick={() => handleDelete(company.id)} className={styles.deleteBtn}>
                                        Zmazať
                                    </button>
                                </div>
                            </div>

                            <div className={styles.companyDetails}>
                                {company.ico && <span>IČO: {company.ico}</span>}
                                {company.dic && <span>DIČ: {company.dic}</span>}
                                {company.city && <span>{company.address}, {company.city} {company.postal_code}</span>}
                            </div>

                            {/* Salons List */}
                            <div className={styles.salonsSection}>
                                <button
                                    className={styles.salonsToggle}
                                    onClick={() => toggleExpand(company.id)}
                                >
                                    <span className={styles.salonCount}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                                        </svg>
                                        {company.salons?.length || 0} salónov
                                    </span>
                                    <span className={`${styles.expandIcon} ${expandedCompanies.has(company.id) ? styles.expanded : ''}`}>
                                        ▼
                                    </span>
                                </button>

                                {expandedCompanies.has(company.id) && (
                                    <div className={styles.salonsList}>
                                        {company.salons && company.salons.length > 0 ? (
                                            company.salons.map(salon => (
                                                <Link
                                                    key={salon.id}
                                                    href={`/dashboard/moj-salon/${salon.id}`}
                                                    className={styles.salonItem}
                                                >
                                                    <span className={styles.salonItemId}>#{salon.display_id}</span>
                                                    <span className={styles.salonItemName}>{salon.name}</span>
                                                    <span className={styles.salonItemCity}>{salon.city}</span>
                                                    {getStatusBadge(salon.status)}
                                                </Link>
                                            ))
                                        ) : (
                                            <div className={styles.noSalons}>
                                                <p>Zatiaľ žiadne salóny</p>
                                                <Link href="/dashboard/moj-salon/new" className={styles.addSalonLink}>
                                                    + Pridať salón
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
