import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getLivestock } from '../../../services/livestockService';
import { GENDER_I18N_MAP, STATUS_I18N_MAP, ACQUISITION_I18N_MAP } from '../../../utils/i18nMappings';
import { Livestock } from '../../../types/livestock';
import '../../../theme/PageCommon.css';

const LivestockProfilePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation(['common', 'animals', 'health', 'breeding', 'milk']);
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
    if (!livestock) return <div className="page"><div className="dashboard-error"><h3>{t('animals:errors.notFound')}</h3></div></div>;

    return (
        <div className="page">
            <div className="page__header">
                <div>
                    <h1>{livestock.name || livestock.tagNumber}</h1>
                    <p className="dashboard__updated">{t('animals:fields.tagShort')}: {livestock.tagNumber} | {t('animals:fields.species')}: {livestock.species}</p>
                </div>
                <button className="btn btn-secondary" onClick={() => navigate('/livestock')}>
                    &larr; {t('animals:actions.backToDirectory')}
                </button>
            </div>

            <div className="grid grid-cols-2" style={{ gap: 'var(--space-xl)', marginBottom: 'var(--space-xl)' }}>
                {/* Details Card */}
                <div className="glass-card" style={{ padding: 'var(--space-xl)' }}>
                    <h3 style={{ marginTop: 0, borderBottom: '1px solid var(--border)', paddingBottom: 'var(--space-sm)' }}>
                        {t('animals:sections.general')}
                    </h3>
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
                        <div>
                            <span style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>{t('breeding:fields.status')}</span>
                            <div>
                                <span className={`status-badge status-${livestock.status?.toLowerCase()}`}>
                                    {t(STATUS_I18N_MAP[livestock.status || 'Active'] || (livestock.status || 'Active') as any)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Acquisition Card */}
                <div className="glass-card" style={{ padding: 'var(--space-xl)' }}>
                    <h3 style={{ marginTop: 0, borderBottom: '1px solid var(--border)', paddingBottom: 'var(--space-sm)' }}>
                        {t('animals:sections.acquisition')}
                    </h3>
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
                </div>
            </div>

            {/* Health Records */}
            <div className="glass-card" style={{ padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
                    <h3 style={{ margin: 0 }}>{t('health:sections.records')}</h3>
                    <button className="btn btn-primary">{t('health:actions.addRecord')}</button>
                </div>
                {livestock.healthRecords && livestock.healthRecords.length > 0 ? (
                    <div className="table-responsive">
                        <table className="livestock-table">
                            <thead>
                                <tr>
                                    <th>{t('milk:fields.date')}</th>
                                    <th>{t('health:fields.condition')}</th>
                                    <th>{t('health:fields.treatment')}</th>
                                    <th>{t('health:fields.veterinarian')}</th>
                                    <th>{t('health:fields.cost')}</th>
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
                    <p style={{ color: 'var(--text-muted)' }}>{t('health:empty.noRecords')}</p>
                )}
            </div>

            {/* Breeding Cycles */}
            <div className="glass-card" style={{ padding: 'var(--space-xl)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
                    <h3 style={{ margin: 0 }}>{t('breeding:sections.cycles')}</h3>
                    <button className="btn btn-primary">{t('breeding:actions.addCycle')}</button>
                </div>
                {livestock.breedingCycles && livestock.breedingCycles.length > 0 ? (
                    <div className="table-responsive">
                        <table className="livestock-table">
                            <thead>
                                <tr>
                                    <th>{t('breeding:fields.startDate')}</th>
                                    <th>{t('breeding:fields.inseminationDate')}</th>
                                    <th>{t('breeding:fields.expectedCalving')}</th>
                                    <th>{t('breeding:fields.status')}</th>
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
                                                {cycle.isSuccessful ? t('breeding:status.successful') : t('breeding:status.pendingOrFailed')}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p style={{ color: 'var(--text-muted)' }}>{t('breeding:empty.noCycles')}</p>
                )}
            </div>

        </div>
    );
};

export default LivestockProfilePage;
