import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getLivestocks } from '../../../services/livestockService';
import { Livestock } from '../../../types/livestock';
import { DAIRY_SESSION_I18N_MAP } from '../../../utils/i18nMappings';
import './Dairy.css';

interface DairyFiltersProps {
    filters: {
        startDate?: string;
        endDate?: string;
        livestockId?: string;
        session?: string;
    };
    onFiltersChange: (filters: any) => void;
}

const DairyFilters: React.FC<DairyFiltersProps> = ({ filters, onFiltersChange }) => {
    const { t } = useTranslation(['common', 'milk', 'animals']);
    const [quickRange, setQuickRange] = useState<string>('today');
    const [livestocks, setLivestocks] = useState<Livestock[]>([]);

    useEffect(() => {
        // Fetch livestock for the dropdown (assuming it doesn't exceed 100 for now, but a searchable select is better long term)
        getLivestocks(1, 100).then(data => {
            setLivestocks(data.items || []);
        }).catch(err => console.error(err));
    }, []);

    // Set initial custom range if quickRange is custom
    useEffect(() => {
        if (!filters.startDate && !filters.endDate && quickRange !== 'custom') {
            handleQuickRangeChange(quickRange);
        }
    }, []);

    const handleQuickRangeChange = (range: string) => {
        setQuickRange(range);
        
        const now = new Date();
        const startOfToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
        const endOfToday = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000);

        if (range === 'today') {
            onFiltersChange({ ...filters, startDate: startOfToday.toISOString(), endDate: endOfToday.toISOString() });
        } else if (range === 'thisWeek') {
            // Monday to next Monday UTC
            const dayOfWeek = now.getUTCDay();
            const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 0 is Sunday
            const startOfWeek = new Date(startOfToday.getTime() - daysToMonday * 24 * 60 * 60 * 1000);
            const endOfWeek = new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000);
            
            onFiltersChange({ ...filters, startDate: startOfWeek.toISOString(), endDate: endOfWeek.toISOString() });
        } else if (range === 'all') {
             onFiltersChange({ ...filters, startDate: undefined, endDate: undefined });
        } else {
            // custom, leave dates as they are or clear them to force user input
        }
    };

    const handleCustomDateChange = (field: 'startDate' | 'endDate', value: string) => {
        setQuickRange('custom');
        const updated = { ...filters, [field]: value ? new Date(value).toISOString() : undefined };
        
        // Validate
        if (updated.startDate && updated.endDate && new Date(updated.startDate) > new Date(updated.endDate)) {
            // Reset endDate if invalid
            updated.endDate = undefined;
        }
        
        onFiltersChange(updated);
    };

    const formatDateForInput = (isoString?: string) => {
        if (!isoString) return '';
        // Convert UTC to local format for HTML date input (YYYY-MM-DD)
        return isoString.split('T')[0];
    };

    const clearFilters = () => {
        setQuickRange('all');
        onFiltersChange({ startDate: undefined, endDate: undefined, livestockId: undefined, session: undefined });
    };

    return (
        <div className="dairy-filters card">
            <div className="filter-group">
                <label>{t('common:dateRange' as any)}</label>
                <div className="filter-controls">
                    <select 
                        value={quickRange} 
                        onChange={(e) => handleQuickRangeChange(e.target.value)}
                        className="form-control"
                    >
                        <option value="today">{t('common:today' as any)}</option>
                        <option value="thisWeek">{t('common:thisWeek' as any)}</option>
                        <option value="all">{t('common:allTime' as any, 'All Time')}</option>
                        <option value="custom">{t('common:custom' as any)}</option>
                    </select>

                    {quickRange === 'custom' && (
                        <>
                            <input 
                                type="date" 
                                value={formatDateForInput(filters.startDate)} 
                                onChange={(e) => handleCustomDateChange('startDate', e.target.value)}
                                className="form-control"
                            />
                            <span>-</span>
                            <input 
                                type="date" 
                                value={formatDateForInput(filters.endDate)} 
                                onChange={(e) => handleCustomDateChange('endDate', e.target.value)}
                                className="form-control"
                            />
                        </>
                    )}
                </div>
            </div>

            <div className="filter-group">
                <label>{t('animals:title')}</label>
                <select 
                    value={filters.livestockId || ''} 
                    onChange={(e) => onFiltersChange({ ...filters, livestockId: e.target.value || undefined })}
                    className="form-control"
                >
                    <option value="">{t('common:all' as any)}</option>
                    {livestocks.map(l => (
                        <option key={l.id} value={l.id}>{l.tagNumber || l.name}</option>
                    ))}
                </select>
            </div>

            <div className="filter-group">
                <label>{t('milk:fields.session')}</label>
                <select 
                    value={filters.session || ''} 
                    onChange={(e) => onFiltersChange({ ...filters, session: e.target.value || undefined })}
                    className="form-control"
                >
                    <option value="">{t('common:all' as any)}</option>
                    {Object.entries(DAIRY_SESSION_I18N_MAP).map(([key, value]) => (
                        <option key={key} value={key}>{t(value as any)}</option>
                    ))}
                </select>
            </div>

            <div className="filter-actions">
                <button type="button" className="btn btn-secondary" onClick={clearFilters}>
                    {t('common:clearFilters', 'Clear Filters')}
                </button>
            </div>
        </div>
    );
};

export default DairyFilters;
