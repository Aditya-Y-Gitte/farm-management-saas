import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createIncome, createExpense } from '../../../services/FinanceService';
import { CreateIncomeRequest, CreateExpenseRequest } from '../../../types/finance';
import { TRANSACTION_TYPES, INCOME_SOURCES, EXPENSE_CATEGORIES } from '../../../constants/appConstants';

interface FinanceFormProps {
    onTransactionCreated: () => void;
}

const FinanceForm: React.FC<FinanceFormProps> = ({ onTransactionCreated }) => {
    const { t } = useTranslation();
    const [transactionType, setTransactionType] = useState<typeof TRANSACTION_TYPES[keyof typeof TRANSACTION_TYPES]>(TRANSACTION_TYPES.INCOME);
    
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        category: INCOME_SOURCES[0] as string,
        amount: 0,
        notes: '',
        quantity: 0,
        rate: 0,
        buyerName: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleTypeChange = (type: typeof TRANSACTION_TYPES[keyof typeof TRANSACTION_TYPES]) => {
        setTransactionType(type);
        setFormData(prev => ({
            ...prev,
            category: type === TRANSACTION_TYPES.INCOME ? INCOME_SOURCES[0] : EXPENSE_CATEGORIES[0]
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            if (transactionType === TRANSACTION_TYPES.INCOME) {
                const request: CreateIncomeRequest = {
                    date: new Date(formData.date).toISOString(),
                    category: formData.category,
                    amount: formData.amount,
                    notes: formData.notes,
                    quantity: formData.quantity || undefined,
                    rate: formData.rate || undefined,
                    buyerName: formData.buyerName || undefined
                };
                await createIncome(request);
            } else {
                const request: CreateExpenseRequest = {
                    date: new Date(formData.date).toISOString(),
                    category: formData.category,
                    amount: formData.amount,
                    notes: formData.notes
                };
                await createExpense(request);
            }
            onTransactionCreated();
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || t('An error occurred'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
                <button 
                    type="button"
                    className={`btn ${transactionType === TRANSACTION_TYPES.INCOME ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => handleTypeChange(TRANSACTION_TYPES.INCOME)}
                    style={{ flex: 1 }}
                >
                    {t('Income')}
                </button>
                <button 
                    type="button"
                    className={`btn ${transactionType === TRANSACTION_TYPES.EXPENSE ? 'btn-danger' : 'btn-secondary'}`}
                    onClick={() => handleTypeChange(TRANSACTION_TYPES.EXPENSE)}
                    style={{ flex: 1 }}
                >
                    {t('Expense')}
                </button>
            </div>

            {error && <div className="login-error" style={{ marginBottom: 'var(--space-md)' }}>{error}</div>}

            <form onSubmit={handleSubmit} className="grid grid-cols-2" style={{ gap: 'var(--space-md)' }}>
                <div className="form-group">
                    <label htmlFor="date">{t('Date')} *</label>
                    <input className="form-control" id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label htmlFor="category">{t('Category')} *</label>
                    <select className="form-control" id="category" name="category" value={formData.category} onChange={handleChange} required>
                        {transactionType === TRANSACTION_TYPES.INCOME 
                            ? INCOME_SOURCES.map(source => <option key={source} value={source}>{t(source)}</option>)
                            : EXPENSE_CATEGORIES.map(category => <option key={category} value={category}>{t(category)}</option>)
                        }
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="amount">{t('Total Amount (₹)')} *</label>
                    <input className="form-control" id="amount" name="amount" type="number" step="0.01" min="0.01" value={formData.amount || ''} onChange={handleChange} required />
                </div>

                {transactionType === TRANSACTION_TYPES.INCOME && (
                    <>
                        <div className="form-group">
                            <label htmlFor="quantity">{t('Quantity')} ({t('Optional')})</label>
                            <input className="form-control" id="quantity" name="quantity" type="number" step="0.01" value={formData.quantity || ''} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="rate">{t('Rate')} ({t('Optional')})</label>
                            <input className="form-control" id="rate" name="rate" type="number" step="0.01" value={formData.rate || ''} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="buyerName">{t('Buyer Name')} ({t('Optional')})</label>
                            <input className="form-control" id="buyerName" name="buyerName" type="text" value={formData.buyerName} onChange={handleChange} />
                        </div>
                    </>
                )}

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label htmlFor="notes">{t('Notes')} ({t('Optional')})</label>
                    <textarea className="form-control" id="notes" name="notes" rows={3} value={formData.notes} onChange={handleChange}></textarea>
                </div>

                <div style={{ gridColumn: '1 / -1', marginTop: 'var(--space-md)', display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" className={`btn ${transactionType === TRANSACTION_TYPES.INCOME ? 'btn-primary' : 'btn-danger'}`} disabled={isSubmitting} style={{ minWidth: '150px' }}>
                        {isSubmitting ? t('Saving...') : t('Save Transaction')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FinanceForm;
