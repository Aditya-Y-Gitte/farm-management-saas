import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getLivestock } from '../services/livestockService';
import { Livestock } from '../types/livestock';
import './PageCommon.css';

const LivestockProfilePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [livestock, setLivestock] = useState<Livestock | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLivestock = async () => {
            if (!id) return;
            try {
                const data = await getLivestock(id);
                setLivestock(data);
            } catch (error) {
                console.error("Failed to fetch livestock details", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLivestock();
    }, [id]);

    if (loading) return <div className="loading-screen"><div className="loading-spinner"></div></div>;
    if (!livestock) return <div className="page"><div className="dashboard-error"><h3>{t('Livestock not found')}</h3></div></div>;

    return (
        <div className="page">
            <div className="page__header">
                <div>
                    <h1>{livestock.name || livestock.tagNumber}</h1>
                    <p className="dashboard__updated">{t('Tag')}: {livestock.tagNumber} | {t('Species')}: {livestock.species}</p>
                </div>
                <button className="btn btn-secondary" onClick={() => navigate('/livestock')}>
                    &larr; {t('Back to Directory')}
                </button>
            </div>

            <div className="grid grid-cols-2" style={{ gap: 'var(--space-xl)', marginBottom: 'var(--space-xl)' }}>
                {/* Details Card */}
                <div className="glass-card" style={{ padding: 'var(--space-xl)' }}>
                    <h3 style={{ marginTop: 0, borderBottom: '1px solid var(--border)', paddingBottom: 'var(--space-sm)' }}>
                        {t('General Information')}
                    </h3>
                    <div className="grid grid-cols-2" style={{ gap: 'var(--space-md)' }}>
                        <div>
                            <span style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>{t('Breed')}</span>
                            <div style={{ fontWeight: 600 }}>{livestock.breed || '-'}</div>
                        </div>
                        <div>
                            <span style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>{t('Gender')}</span>
                            <div style={{ fontWeight: 600 }}>{t(livestock.gender)}</div>
                        </div>
                        <div>
                            <span style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>{t('Date of Birth')}</span>
                            <div style={{ fontWeight: 600 }}>{new Date(livestock.dateOfBirth).toLocaleDateString()}</div>
                        </div>
                        <div>
                            <span style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>{t('Status')}</span>
                            <div>
                                <span className={`status-badge status-${livestock.status?.toLowerCase()}`}>
                                    {t(livestock.status || 'Active')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Acquisition Card */}
                <div className="glass-card" style={{ padding: 'var(--space-xl)' }}>
                    <h3 style={{ marginTop: 0, borderBottom: '1px solid var(--border)', paddingBottom: 'var(--space-sm)' }}>
                        {t('Acquisition Details')}
                    </h3>
                    <div className="grid grid-cols-2" style={{ gap: 'var(--space-md)' }}>
                        <div>
                            <span style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>{t('Type')}</span>
                            <div style={{ fontWeight: 600 }}>{t(livestock.acquisitionType)}</div>
                        </div>
                        {livestock.acquisitionType === 'Purchased' && (
                            <>
                                <div>
                                    <span style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>{t('Purchase Price')}</span>
                                    <div style={{ fontWeight: 600 }}>₹{livestock.purchasePrice}</div>
                                </div>
                                <div>
                                    <span style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>{t('Purchase Date')}</span>
                                    <div style={{ fontWeight: 600 }}>
                                        {livestock.purchaseDate ? new Date(livestock.purchaseDate).toLocaleDateString() : '-'}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Health Records */}
            <div className="glass-card" style={{ padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
                    <h3 style={{ margin: 0 }}>{t('Health Records')}</h3>
                    <button className="btn btn-primary">{t('Add Record')}</button>
                </div>
                {livestock.healthRecords && livestock.healthRecords.length > 0 ? (
                    <div className="table-responsive">
                        <table className="livestock-table">
                            <thead>
                                <tr>
                                    <th>{t('Date')}</th>
                                    <th>{t('Condition')}</th>
                                    <th>{t('Treatment')}</th>
                                    <th>{t('Veterinarian')}</th>
                                    <th>{t('Cost')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {livestock.healthRecords.map(record => (
                                    <tr key={record.id}>
                                        <td>{new Date(record.date).toLocaleDateString()}</td>
                                        <td>{record.condition}</td>
                                        <td>{record.treatment}</td>
                                        <td>{record.veterinarian}</td>
                                        <td>₹{record.cost}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p style={{ color: 'var(--text-muted)' }}>{t('No health records found.')}</p>
                )}
            </div>

            {/* Breeding Cycles */}
            <div className="glass-card" style={{ padding: 'var(--space-xl)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
                    <h3 style={{ margin: 0 }}>{t('Breeding Cycles')}</h3>
                    <button className="btn btn-primary">{t('Add Cycle')}</button>
                </div>
                {livestock.breedingCycles && livestock.breedingCycles.length > 0 ? (
                    <div className="table-responsive">
                        <table className="livestock-table">
                            <thead>
                                <tr>
                                    <th>{t('Start Date')}</th>
                                    <th>{t('Insemination Date')}</th>
                                    <th>{t('Expected Calving')}</th>
                                    <th>{t('Status')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {livestock.breedingCycles.map(cycle => (
                                    <tr key={cycle.id}>
                                        <td>{new Date(cycle.cycleStartDate).toLocaleDateString()}</td>
                                        <td>{cycle.inseminationDate ? new Date(cycle.inseminationDate).toLocaleDateString() : '-'}</td>
                                        <td>{cycle.expectedCalvingDate ? new Date(cycle.expectedCalvingDate).toLocaleDateString() : '-'}</td>
                                        <td>
                                            <span className={`status-badge ${cycle.isSuccessful ? 'status-active' : 'status-sold'}`}>
                                                {cycle.isSuccessful ? t('Successful') : t('Pending/Failed')}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p style={{ color: 'var(--text-muted)' }}>{t('No breeding cycles found.')}</p>
                )}
            </div>

        </div>
    );
};

export default LivestockProfilePage;
