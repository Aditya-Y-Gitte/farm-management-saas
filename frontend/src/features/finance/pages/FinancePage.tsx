import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getIncomes, getExpenses } from '../../../services/financeService';
import { Income, Expense } from '../../../types/finance';
import { TRANSACTION_TYPES } from '../../../constants/appConstants';
import FinanceForm from '../components/FinanceForm';
import '../../../theme/PageCommon.css';

const FinancePage: React.FC = () => {
    const { t } = useTranslation();
    const [incomes, setIncomes] = useState<Income[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<typeof TRANSACTION_TYPES[keyof typeof TRANSACTION_TYPES]>(TRANSACTION_TYPES.INCOME);
    const [showForm, setShowForm] = useState(false);

    const fetchFinances = async () => {
        setLoading(true);
        try {
            const [incomeData, expenseData] = await Promise.all([
                getIncomes(),
                getExpenses()
            ]);
            setIncomes(incomeData.items || []);
            setExpenses(expenseData.items || []);
        } catch (err) {
            console.error(t("Failed to fetch finances"), err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFinances();
    }, []);

    const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
    const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
    const profit = totalIncome - totalExpense;

    if (showForm) {
        return (
            <div className="page">
                <div className="page__header">
                    <h1>💰 {t('Add Transaction')}</h1>
                    <button className="btn btn-secondary" onClick={() => setShowForm(false)}>
                        {t('Back to Ledger')}
                    </button>
                </div>
                <div className="glass-card" style={{ padding: 'var(--space-xl)' }}>
                    <FinanceForm onTransactionCreated={() => {
                        setShowForm(false);
                        fetchFinances();
                    }} />
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="page__header">
                <h1>💰 {t('Finance Ledger')}</h1>
                <button className="page__action-btn" onClick={() => setShowForm(true)}>
                    + {t('Add Transaction')}
                </button>
            </div>

            {/* Financial Summary Cards */}
            <div className="grid grid-cols-3" style={{ gap: 'var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
                <div className="glass-card" style={{ padding: 'var(--space-lg)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontSize: 'var(--font-size-sm)' }}>{t('Total Income')}</span>
                    <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)' }}>₹{totalIncome.toLocaleString()}</span>
                </div>
                <div className="glass-card" style={{ padding: 'var(--space-lg)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontSize: 'var(--font-size-sm)' }}>{t('Total Expenses')}</span>
                    <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--danger)' }}>₹{totalExpense.toLocaleString()}</span>
                </div>
                <div className="glass-card" style={{ padding: 'var(--space-lg)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontSize: 'var(--font-size-sm)' }}>{t('Net Profit')}</span>
                    <span style={{ fontSize: '2rem', fontWeight: 800, color: profit >= 0 ? 'var(--success)' : 'var(--danger)' }}>₹{profit.toLocaleString()}</span>
                </div>
            </div>

            <div className="glass-card" style={{ padding: 'var(--space-xl)' }}>
                <div style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)', borderBottom: '1px solid var(--border)', paddingBottom: 'var(--space-sm)' }}>
                    <button 
                        className={`btn ${activeTab === TRANSACTION_TYPES.INCOME ? 'btn-primary' : 'btn-secondary'}`} 
                        onClick={() => setActiveTab(TRANSACTION_TYPES.INCOME)}
                    >
                        {t('Income')}
                    </button>
                    <button 
                        className={`btn ${activeTab === TRANSACTION_TYPES.EXPENSE ? 'btn-primary' : 'btn-secondary'}`} 
                        onClick={() => setActiveTab(TRANSACTION_TYPES.EXPENSE)}
                    >
                        {t('Expenses')}
                    </button>
                </div>

                {loading ? (
                    <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
                ) : (
                    <div className="table-responsive">
                        {activeTab === TRANSACTION_TYPES.INCOME ? (
                            <table className="livestock-table">
                                <thead>
                                    <tr>
                                        <th>{t('Date')}</th>
                                        <th>{t('Category')}</th>
                                        <th>{t('Notes')}</th>
                                        <th>{t('Amount')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {incomes.map(item => (
                                        <tr key={item.id}>
                                            <td>{new Date(item.date).toLocaleDateString()}</td>
                                            <td>{t(item.category)}</td>
                                            <td>{item.notes || '-'}</td>
                                            <td style={{ color: 'var(--success)', fontWeight: 600 }}>+₹{item.amount.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                    {incomes.length === 0 && (
                                        <tr><td colSpan={4} className="text-center">{t('No income records found.')}</td></tr>
                                    )}
                                </tbody>
                            </table>
                        ) : (
                            <table className="livestock-table">
                                <thead>
                                    <tr>
                                        <th>{t('Date')}</th>
                                        <th>{t('Category')}</th>
                                        <th>{t('Notes')}</th>
                                        <th>{t('Amount')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {expenses.map(item => (
                                        <tr key={item.id}>
                                            <td>{new Date(item.date).toLocaleDateString()}</td>
                                            <td>{t(item.category)}</td>
                                            <td>{item.notes || '-'}</td>
                                            <td style={{ color: 'var(--danger)', fontWeight: 600 }}>-₹{item.amount.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                    {expenses.length === 0 && (
                                        <tr><td colSpan={4} className="text-center">{t('No expense records found.')}</td></tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FinancePage;
