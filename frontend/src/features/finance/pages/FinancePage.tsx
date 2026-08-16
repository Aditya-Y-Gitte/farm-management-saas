import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getIncomes, getExpenses, getFinanceSummary } from '../../../services/financeService';
import { INCOME_SOURCE_I18N_MAP, EXPENSE_CATEGORY_I18N_MAP } from '../../../utils/i18nMappings';
import { Income, Expense, FinanceSummaryDto } from '../../../types/finance';
import { TRANSACTION_TYPES } from '../../../constants/appConstants';
import FinanceForm from '../components/FinanceForm';
import { useFormatters } from '../../../utils/useFormatters';
import '../../../theme/PageCommon.css';

const FinancePage: React.FC = () => {
    const { t } = useTranslation(['common', 'navigation', 'dashboard', 'animals', 'milk', 'health', 'breeding', 'finance']);
    const { formatDate, formatCurrency } = useFormatters();
    
    // Ledger states
    const [incomes, setIncomes] = useState<Income[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    
    // Pagination states
    const [incomePage, setIncomePage] = useState(1);
    const [expensePage, setExpensePage] = useState(1);
    const [incomeTotalPages, setIncomeTotalPages] = useState(1);
    const [expenseTotalPages, setExpenseTotalPages] = useState(1);
    
    // Summary state
    const [summary, setSummary] = useState<FinanceSummaryDto | null>(null);
    
    // UI states
    const [loadingSummary, setLoadingSummary] = useState(true);
    const [loadingLedger, setLoadingLedger] = useState(true);
    const [activeTab, setActiveTab] = useState<typeof TRANSACTION_TYPES[keyof typeof TRANSACTION_TYPES]>(TRANSACTION_TYPES.INCOME);
    const [showForm, setShowForm] = useState(false);

    const fetchSummary = async () => {
        setLoadingSummary(true);
        try {
            const data = await getFinanceSummary();
            setSummary(data);
        } catch (err) {
            console.error(t('finance:errors.fetchFailed'), err);
        } finally {
            setLoadingSummary(false);
        }
    };

    const fetchIncomes = async (page: number) => {
        try {
            const data = await getIncomes(page, 20);
            setIncomes(data.items || []);
            setIncomeTotalPages(data.totalPages || 1);
        } catch (err) {
            console.error(t('finance:errors.fetchFailed'), err);
        }
    };

    const fetchExpenses = async (page: number) => {
        try {
            const data = await getExpenses(page, 20);
            setExpenses(data.items || []);
            setExpenseTotalPages(data.totalPages || 1);
        } catch (err) {
            console.error(t('finance:errors.fetchFailed'), err);
        }
    };

    const fetchLedger = async () => {
        setLoadingLedger(true);
        if (activeTab === TRANSACTION_TYPES.INCOME) {
            await fetchIncomes(incomePage);
        } else {
            await fetchExpenses(expensePage);
        }
        setLoadingLedger(false);
    };

    // Load summary once on mount
    useEffect(() => {
        fetchSummary();
    }, []);

    // Load ledger when tab or page changes
    useEffect(() => {
        fetchLedger();
    }, [activeTab, incomePage, expensePage]);

    const handleTransactionCreated = () => {
        setShowForm(false);
        fetchSummary(); // Refresh summary based on authoritative backend
        if (activeTab === TRANSACTION_TYPES.INCOME) {
            setIncomePage(1); // Reset to page 1 to see new item
        } else {
            setExpensePage(1);
        }
        fetchLedger();
    };

    if (showForm) {
        return (
            <div className="page">
                <div className="page__header">
                    <h1>💰 {t('finance:addTransaction')}</h1>
                    <button className="btn btn-secondary" onClick={() => setShowForm(false)}>
                        {t('finance:actions.backToLedger')}
                    </button>
                </div>
                <div className="glass-card" style={{ padding: 'var(--space-xl)' }}>
                    <FinanceForm onTransactionCreated={handleTransactionCreated} />
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="page__header">
                <h1>💰 {t('finance:title')}</h1>
                <button className="page__action-btn" onClick={() => setShowForm(true)}>
                    + {t('finance:addTransaction')}
                </button>
            </div>

            {/* Financial Summary Cards */}
            <div className="grid grid-cols-3" style={{ gap: 'var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
                <div className="glass-card" style={{ padding: 'var(--space-lg)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontSize: 'var(--font-size-sm)' }}>
                        {t('finance:summary.thisMonth', 'This Month')} - {t('finance:summary.totalIncome', 'Total Income')}
                    </span>
                    <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)' }}>
                        {loadingSummary ? '...' : `+${formatCurrency(summary?.totalIncomeThisMonth || 0)}`}
                    </span>
                </div>
                <div className="glass-card" style={{ padding: 'var(--space-lg)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontSize: 'var(--font-size-sm)' }}>
                        {t('finance:summary.thisMonth', 'This Month')} - {t('finance:summary.totalExpenses', 'Total Expenses')}
                    </span>
                    <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--danger)' }}>
                        {loadingSummary ? '...' : `-${formatCurrency(summary?.totalExpenseThisMonth || 0)}`}
                    </span>
                </div>
                <div className="glass-card" style={{ padding: 'var(--space-lg)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontSize: 'var(--font-size-sm)' }}>
                        {t('finance:summary.thisMonth', 'This Month')} - {t('finance:summary.netBalance', 'Net Balance')}
                    </span>
                    <span style={{ fontSize: '2rem', fontWeight: 800, color: (summary?.netBalance || 0) >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                        {loadingSummary ? '...' : formatCurrency(summary?.netBalance || 0)}
                    </span>
                </div>
            </div>

            <div className="glass-card" style={{ padding: 'var(--space-xl)' }}>
                <div style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)', borderBottom: '1px solid var(--border)', paddingBottom: 'var(--space-sm)' }}>
                    <button 
                        className={`btn ${activeTab === TRANSACTION_TYPES.INCOME ? 'btn-primary' : 'btn-secondary'}`} 
                        onClick={() => setActiveTab(TRANSACTION_TYPES.INCOME)}
                    >
                        {t('finance:income')}
                    </button>
                    <button 
                        className={`btn ${activeTab === TRANSACTION_TYPES.EXPENSE ? 'btn-primary' : 'btn-secondary'}`} 
                        onClick={() => setActiveTab(TRANSACTION_TYPES.EXPENSE)}
                    >
                        {t('finance:expenses')}
                    </button>
                </div>

                {loadingLedger ? (
                    <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
                ) : (
                    <div className="table-responsive">
                        {activeTab === TRANSACTION_TYPES.INCOME ? (
                            <>
                                <table className="livestock-table">
                                    <thead>
                                        <tr>
                                            <th>{t('milk:fields.date')}</th>
                                            <th>{t('finance:fields.category')}</th>
                                            <th>{t('finance:fields.notes')}</th>
                                            <th>{t('finance:fields.amount')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {incomes.map(item => (
                                            <tr key={item.id}>
                                                <td>{formatDate(item.date)}</td>
                                                <td>{t(INCOME_SOURCE_I18N_MAP[item.category] || EXPENSE_CATEGORY_I18N_MAP[item.category] || item.category as any)}</td>
                                                <td>{item.notes || '-'}</td>
                                                <td style={{ color: 'var(--success)', fontWeight: 600 }}>+{formatCurrency(item.amount)}</td>
                                            </tr>
                                        ))}
                                        {incomes.length === 0 && (
                                            <tr><td colSpan={4} className="text-center">{t('finance:empty.noIncome')}</td></tr>
                                        )}
                                    </tbody>
                                </table>
                                {incomes.length > 0 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-md)' }}>
                                        <button className="btn btn-secondary" onClick={() => setIncomePage(p => Math.max(1, p - 1))} disabled={incomePage === 1}>
                                            {t('finance:ledger.previous', 'Previous')}
                                        </button>
                                        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>Page {incomePage} of {incomeTotalPages}</span>
                                        <button className="btn btn-secondary" onClick={() => setIncomePage(p => p + 1)} disabled={incomePage >= incomeTotalPages}>
                                            {t('finance:ledger.next', 'Next')}
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                <table className="livestock-table">
                                    <thead>
                                        <tr>
                                            <th>{t('milk:fields.date')}</th>
                                            <th>{t('finance:fields.category')}</th>
                                            <th>{t('finance:fields.notes')}</th>
                                            <th>{t('finance:fields.amount')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {expenses.map(item => (
                                            <tr key={item.id}>
                                                <td>{formatDate(item.date)}</td>
                                                <td>{t(INCOME_SOURCE_I18N_MAP[item.category] || EXPENSE_CATEGORY_I18N_MAP[item.category] || item.category as any)}</td>
                                                <td>{item.notes || '-'}</td>
                                                <td style={{ color: 'var(--danger)', fontWeight: 600 }}>-{formatCurrency(item.amount)}</td>
                                            </tr>
                                        ))}
                                        {expenses.length === 0 && (
                                            <tr><td colSpan={4} className="text-center">{t('finance:empty.noExpense')}</td></tr>
                                        )}
                                    </tbody>
                                </table>
                                {expenses.length > 0 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-md)' }}>
                                        <button className="btn btn-secondary" onClick={() => setExpensePage(p => Math.max(1, p - 1))} disabled={expensePage === 1}>
                                            {t('finance:ledger.previous', 'Previous')}
                                        </button>
                                        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>Page {expensePage} of {expenseTotalPages}</span>
                                        <button className="btn btn-secondary" onClick={() => setExpensePage(p => p + 1)} disabled={expensePage >= expenseTotalPages}>
                                            {t('finance:ledger.next', 'Next')}
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FinancePage;
