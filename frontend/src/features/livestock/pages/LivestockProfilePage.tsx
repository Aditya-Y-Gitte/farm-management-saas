import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getLivestock } from '../../../services/livestockService';
import { getDairySummary, getDairiesByLivestockId } from '../../../services/dairyService';
import { GENDER_I18N_MAP, STATUS_I18N_MAP, ACQUISITION_I18N_MAP } from '../../../utils/i18nMappings';
import { Livestock } from '../../../types/livestock';
import { Dairy } from '../../../types/dairy';
import { Card } from '../../../components/ui/Card';
import { Badge, BadgeProps } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import Tabs from '../../../components/ui/Tabs';
import { Skeleton } from '../../../components/ui/Skeleton';
import { EmptyState } from '../../../components/ui/EmptyState';
import { ErrorState } from '../../../components/ui/ErrorState';
import { Activity } from 'lucide-react';
import '../../../theme/PageCommon.css';
import '../components/Livestock.css';

interface ActivityEvent {
    id: string;
    date: Date;
    type: 'health' | 'breeding' | 'milk';
    title: string;
    description: string;
}

const getStatusVariant = (status: string): BadgeProps['variant'] => {
    const s = status.toLowerCase();
    if (s === 'active') return 'success';
    if (s === 'sold') return 'neutral';
    if (s === 'sick') return 'warning';
    if (s === 'deceased' || s === 'lost') return 'danger';
    return 'neutral';
};

const milkHistoryCache: Record<string, Dairy[]> = {};

const MilkHistoryTab: React.FC<{ livestockId: string }> = ({ livestockId }) => {
    const { t } = useTranslation(['animals', 'milk', 'common']);
    const [history, setHistory] = useState<Dairy[]>(milkHistoryCache[livestockId] || []);
    const [loading, setLoading] = useState(!milkHistoryCache[livestockId]);
    const [error, setError] = useState<Error | null>(null);

    const fetchHistory = async () => {
        if (milkHistoryCache[livestockId]) {
            setHistory(milkHistoryCache[livestockId]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            // First page for history tab, fetching up to 20
            const data = await getDairiesByLivestockId(livestockId, 1, 20);
            milkHistoryCache[livestockId] = data.items || [];
            setHistory(milkHistoryCache[livestockId]);
        } catch (err: any) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [livestockId]);

    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                <Skeleton width="100%" height="3rem" />
                <Skeleton width="100%" height="3rem" />
                <Skeleton width="100%" height="3rem" />
            </div>
        );
    }

    if (error) {
        return (
            <ErrorState 
                title={t('common:errors.title', { defaultValue: 'Error' })}
                message={error.message || t('common:errors.defaultMessage', { defaultValue: 'Failed to load milk history' })}
                onRetry={fetchHistory}
            />
        );
    }

    if (history.length === 0) {
        return (
            <EmptyState 
                title={t('animals:profile.noRecentActivity')}
            />
        );
    }

    return (
        <div className="table-responsive" style={{ marginTop: 'var(--space-md)' }}>
            <table className="livestock-table">
                <thead>
                    <tr>
                        <th>{t('milk:fields.date', { defaultValue: 'Date' })}</th>
                        <th>{t('milk:fields.session', { defaultValue: 'Session' })}</th>
                        <th>{t('milk:fields.yield', { defaultValue: 'Yield (L)' })}</th>
                        <th>{t('milk:fields.fat', { defaultValue: 'Fat %' })}</th>
                        <th>{t('milk:fields.snf', { defaultValue: 'SNF %' })}</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map(record => (
                        <tr key={record.id}>
                            <td>{new Date(record.date).toLocaleDateString()}</td>
                            <td>{t(`milk:session.${record.session.toLowerCase()}`, { defaultValue: record.session })}</td>
                            <td>{record.milkYield}</td>
                            <td>{record.fatContent}</td>
                            <td>{record.snfContent}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const LivestockProfilePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation(['common', 'animals', 'health', 'breeding', 'milk']);
    
    const [livestock, setLivestock] = useState<Livestock | null>(null);
    const [milkSummary, setMilkSummary] = useState<any>(null);
    const [milkHistory, setMilkHistory] = useState<Dairy[]>([]); // For recent activity composition
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const [lsData, summaryData, recentMilkData] = await Promise.all([
                    getLivestock(id),
                    getDairySummary(id).catch(() => null), // If fails, ignore for summary
                    getDairiesByLivestockId(id, 1, 5).catch(() => ({ items: [] })) // Fetch top 5 for recent activity
                ]);
                setLivestock(lsData);
                setMilkSummary(summaryData);
                setMilkHistory(recentMilkData.items || []);
            } catch (error) {
                console.error("Failed to fetch livestock details", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const recentActivity = useMemo(() => {
        if (!livestock) return [];
        const events: ActivityEvent[] = [];

        // Health Records
        (livestock.healthRecords || []).forEach(hr => {
            events.push({
                id: hr.id,
                date: new Date(hr.date),
                type: 'health',
                title: t('health:sections.records', { defaultValue: 'Health Record' }),
                description: hr.condition
            });
        });

        // Breeding Cycles
        (livestock.breedingCycles || []).forEach(bc => {
            events.push({
                id: bc.id,
                date: new Date(bc.cycleStartDate),
                type: 'breeding',
                title: t('breeding:sections.cycles', { defaultValue: 'Breeding Cycle' }),
                description: bc.isSuccessful ? t('breeding:status.successful', { defaultValue: 'Successful' }) : t('breeding:status.pendingOrFailed', { defaultValue: 'Pending/Failed' })
            });
        });

        // Milk History
        milkHistory.forEach(mh => {
            events.push({
                id: mh.id,
                date: new Date(mh.date),
                type: 'milk',
                title: t('milk:fields.yield', { defaultValue: 'Milk Production' }),
                description: `${mh.milkYield} L (${t(`milk:session.${mh.session.toLowerCase()}`, { defaultValue: mh.session })})`
            });
        });

        events.sort((a, b) => b.date.getTime() - a.date.getTime());
        return events.slice(0, 5);
    }, [livestock, milkHistory, t]);

    if (loading) {
        return (
            <div className="page">
                <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                    <Skeleton width="40%" height="2.5rem" />
                    <Skeleton width="100%" height="15rem" />
                    <Skeleton width="100%" height="15rem" />
                </div>
            </div>
        );
    }

    if (!livestock) {
        return (
            <div className="page">
                <EmptyState 
                    title={t('animals:errors.notFound')} 
                    action={<Button onClick={() => navigate('/livestock')}>{t('animals:actions.backToDirectory')}</Button>}
                />
            </div>
        );
    }

    const tabs = [
        {
            label: t('animals:profile.tabs.overview', { defaultValue: 'Overview' }),
            content: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', marginTop: 'var(--space-md)' }}>
                    <div className="grid grid-cols-2" style={{ gap: 'var(--space-md)' }}>
                        <Card>
                            <Card.Body>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: 'var(--font-size-sm)' }}>
                                            {t('animals:profile.todayMilk', { defaultValue: 'Today\'s Milk' })}
                                        </p>
                                        <h2 style={{ margin: '4px 0 0 0' }}>
                                            {milkSummary?.totalMilkToday ? `${milkSummary.totalMilkToday} L` : '0 L'}
                                        </h2>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Body>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: 'var(--font-size-sm)' }}>
                                            {t('breeding:fields.status', { defaultValue: 'Status' })}
                                        </p>
                                        <div style={{ marginTop: '4px' }}>
                                            <Badge variant={getStatusVariant(livestock.status || 'Active')}>
                                                {t(STATUS_I18N_MAP[livestock.status || 'Active'] || (livestock.status || 'Active') as any)}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>

                    <Card>
                        <Card.Header title={t('animals:profile.recentActivity', { defaultValue: 'Recent Activity' })} />
                        <Card.Body>
                            {recentActivity.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                                    {recentActivity.map(evt => (
                                        <div key={evt.id} style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
                                            <div style={{ padding: '8px', background: 'var(--bg-secondary)', borderRadius: '50%' }}>
                                                <Activity size={16} />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 500 }}>{evt.title}</div>
                                                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>{evt.description}</div>
                                            </div>
                                            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>
                                                {evt.date.toLocaleDateString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ color: 'var(--text-muted)' }}>{t('animals:profile.noRecentActivity', { defaultValue: 'No recent activity' })}</p>
                            )}
                        </Card.Body>
                    </Card>
                </div>
            )
        },
        {
            label: t('animals:profile.tabs.health', { defaultValue: 'Health' }),
            content: (
                <div style={{ marginTop: 'var(--space-md)' }}>
                    {livestock.healthRecords && livestock.healthRecords.length > 0 ? (
                        <div className="table-responsive">
                            <table className="livestock-table">
                                <thead>
                                    <tr>
                                        <th>{t('milk:fields.date', { defaultValue: 'Date' })}</th>
                                        <th>{t('health:fields.condition', { defaultValue: 'Condition' })}</th>
                                        <th>{t('health:fields.treatment', { defaultValue: 'Treatment' })}</th>
                                        <th>{t('health:fields.veterinarian', { defaultValue: 'Veterinarian' })}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {livestock.healthRecords.map(record => (
                                        <tr key={record.id}>
                                            <td>{new Date(record.date).toLocaleDateString()}</td>
                                            <td>{record.condition}</td>
                                            <td>{record.treatment}</td>
                                            <td>{record.veterinarian}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <EmptyState title={t('health:empty.noRecords')} />
                    )}
                </div>
            )
        },
        {
            label: t('animals:profile.tabs.breeding', { defaultValue: 'Breeding' }),
            content: (
                <div style={{ marginTop: 'var(--space-md)' }}>
                    {livestock.breedingCycles && livestock.breedingCycles.length > 0 ? (
                        <div className="table-responsive">
                            <table className="livestock-table">
                                <thead>
                                    <tr>
                                        <th>{t('breeding:fields.startDate', { defaultValue: 'Start Date' })}</th>
                                        <th>{t('breeding:fields.inseminationDate', { defaultValue: 'Insemination' })}</th>
                                        <th>{t('breeding:fields.expectedCalving', { defaultValue: 'Expected Calving' })}</th>
                                        <th>{t('breeding:fields.status', { defaultValue: 'Status' })}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {livestock.breedingCycles.map(cycle => (
                                        <tr key={cycle.id}>
                                            <td>{new Date(cycle.cycleStartDate).toLocaleDateString()}</td>
                                            <td>{cycle.inseminationDate ? new Date(cycle.inseminationDate).toLocaleDateString() : '-'}</td>
                                            <td>{cycle.expectedCalvingDate ? new Date(cycle.expectedCalvingDate).toLocaleDateString() : '-'}</td>
                                            <td>
                                                <Badge variant={cycle.isSuccessful ? 'success' : 'neutral'}>
                                                    {cycle.isSuccessful ? t('breeding:status.successful', { defaultValue: 'Successful' }) : t('breeding:status.pendingOrFailed', { defaultValue: 'Pending/Failed' })}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <EmptyState title={t('breeding:empty.noCycles')} />
                    )}
                </div>
            )
        },
        {
            label: t('animals:profile.tabs.milkHistory', { defaultValue: 'Milk History' }),
            content: <MilkHistoryTab livestockId={id!} />
        },
        {
            label: t('animals:profile.tabs.details', { defaultValue: 'Details' }),
            content: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', marginTop: 'var(--space-md)' }}>
                    <Card>
                        <Card.Header title={t('animals:sections.general', { defaultValue: 'General Information' })} />
                        <Card.Body>
                            <div className="grid grid-cols-2" style={{ gap: 'var(--space-md)' }}>
                                <div>
                                    <span style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>{t('animals:fields.breed')}</span>
                                    <div style={{ fontWeight: 600 }}>{livestock.breed || '-'}</div>
                                </div>
                                <div>
                                    <span style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>{t('animals:fields.gender')}</span>
                                    <div style={{ fontWeight: 600 }}>{t(GENDER_I18N_MAP[livestock.gender] || livestock.gender as any)}</div>
                                </div>
                                <div>
                                    <span style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>{t('animals:fields.dob')}</span>
                                    <div style={{ fontWeight: 600 }}>{new Date(livestock.dateOfBirth).toLocaleDateString()}</div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>

                    <Card>
                        <Card.Header title={t('animals:sections.acquisition', { defaultValue: 'Acquisition Details' })} />
                        <Card.Body>
                            <div className="grid grid-cols-2" style={{ gap: 'var(--space-md)' }}>
                                <div>
                                    <span style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>{t('animals:fields.type')}</span>
                                    <div style={{ fontWeight: 600 }}>{t(ACQUISITION_I18N_MAP[livestock.acquisitionType] || livestock.acquisitionType as any)}</div>
                                </div>
                                {livestock.acquisitionType === 'Purchased' && (
                                    <>
                                        <div>
                                            <span style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>{t('animals:fields.purchasePrice')}</span>
                                            <div style={{ fontWeight: 600 }}>₹{livestock.purchasePrice}</div>
                                        </div>
                                        <div>
                                            <span style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>{t('animals:fields.purchaseDate')}</span>
                                            <div style={{ fontWeight: 600 }}>
                                                {livestock.purchaseDate ? new Date(livestock.purchaseDate).toLocaleDateString() : '-'}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            )
        }
    ];

    return (
        <div className="page">
            <div className="page__header">
                <div>
                    <h1>{livestock.name || livestock.tagNumber}</h1>
                    <p className="dashboard__updated" style={{ margin: '4px 0 0 0' }}>
                        {t('animals:fields.tagShort', { defaultValue: 'Tag' })}: {livestock.tagNumber} | {t('animals:fields.species', { defaultValue: 'Species' })}: {livestock.species}
                    </p>
                </div>
                <Button variant="secondary" onClick={() => navigate('/livestock')}>
                    &larr; {t('animals:actions.backToDirectory', { defaultValue: 'Back to Directory' })}
                </Button>
            </div>

            <Tabs tabs={tabs} />
        </div>
    );
};

export default LivestockProfilePage;
