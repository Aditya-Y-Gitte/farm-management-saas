import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getFeedConsumptions } from '../../../services/feedService';
import { FeedConsumptionDto } from '../../../types/feed';
import { FEED_TYPE_I18N_MAP, FEED_UNIT_I18N_MAP } from '../../../utils/i18nMappings';
import { Button } from '../../../components/ui/Button';
import { useFormatters } from '../../../utils/useFormatters';

const FeedList: React.FC = () => {
    const { t } = useTranslation(['feed', 'common']);
    const { formatDate, formatNumber } = useFormatters();
    
    const [records, setRecords] = useState<FeedConsumptionDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const loadRecords = async (pageNum: number) => {
        try {
            setIsLoading(true);
            setError(null);
            const res = await getFeedConsumptions(pageNum, 20);
            setRecords(res.items || []);
            setTotalPages(res.totalPages || 1);
            setPage(pageNum);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || t('feed:errors.fetchFailed'));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadRecords(1);
    }, []);

    if (isLoading && records.length === 0) {
        return <div className="text-center p-4">{t('common:loading', { defaultValue: 'Loading...' })}</div>;
    }

    if (error) {
        return (
            <div className="alert alert-danger" style={{ marginBottom: 'var(--space-md)' }}>
                {error}
                <br/>
                <Button variant="secondary" onClick={() => loadRecords(page)} style={{ marginTop: '8px' }}>
                    {t('common:actions.retry')}
                </Button>
            </div>
        );
    }

    if (records.length === 0) {
        return (
            <div className="card text-center" style={{ padding: '40px' }}>
                <p style={{ color: 'var(--text-secondary)' }}>{t('feed:empty')}</p>
            </div>
        );
    }

    return (
        <div className="card">
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>{t('feed:fields.date')}</th>
                            <th>{t('feed:fields.livestock')}</th>
                            <th>{t('feed:fields.feedType')}</th>
                            <th>{t('feed:fields.quantity')}</th>
                            <th>{t('feed:fields.notes')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map(r => (
                            <tr key={r.id}>
                                <td>{formatDate(r.date)}</td>
                                <td>{r.livestockId ? r.livestockId.substring(0, 8) + '...' : t('feed:fields.herdWide')}</td>
                                <td>{t(FEED_TYPE_I18N_MAP[r.feedType] || r.feedType as any)}</td>
                                <td>{formatNumber(r.quantity)} {t(FEED_UNIT_I18N_MAP[r.unit] || r.unit as any)}</td>
                                <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.notes}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderTop: '1px solid var(--border-color)' }}>
                    <Button 
                        variant="secondary" 
                        disabled={page <= 1} 
                        onClick={() => loadRecords(page - 1)}
                    >
                        {t('common:actions.previous', { defaultValue: 'Previous' })}
                    </Button>
                    <span>{page} / {totalPages}</span>
                    <Button 
                        variant="secondary" 
                        disabled={page >= totalPages} 
                        onClick={() => loadRecords(page + 1)}
                    >
                        {t('common:actions.next', { defaultValue: 'Next' })}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default FeedList;
