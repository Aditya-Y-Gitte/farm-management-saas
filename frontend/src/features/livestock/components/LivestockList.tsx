import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { getLivestocks } from '../../../services/livestockService';
import { STATUS_I18N_MAP } from '../../../utils/i18nMappings';
import { Livestock } from '../../../types/livestock';
import { LIVESTOCK_SPECIES, LIVESTOCK_STATUSES } from '../../../constants/appConstants';
import { Card } from '../../../components/ui/Card';
import { Badge, BadgeProps } from '../../../components/ui/Badge';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { Skeleton } from '../../../components/ui/Skeleton';
import { EmptyState } from '../../../components/ui/EmptyState';
import { ErrorState } from '../../../components/ui/ErrorState';
import './Livestock.css';

interface LivestockListProps {
    refresh?: boolean;
}

const getStatusVariant = (status: string): BadgeProps['variant'] => {
    const s = status.toLowerCase();
    if (s === 'active') return 'success';
    if (s === 'sold') return 'neutral';
    if (s === 'sick') return 'warning';
    if (s === 'deceased' || s === 'lost') return 'danger';
    return 'neutral';
};

const LivestockList: React.FC<LivestockListProps> = ({ refresh = false }) => {
    const { t } = useTranslation(['common', 'animals', 'breeding']);
    const navigate = useNavigate();
    
    // API State
    const [livestocks, setLivestocks] = useState<Livestock[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [speciesFilter, setSpeciesFilter] = useState('ALL');
    const [statusFilter, setStatusFilter] = useState('ALL');

    const fetchLivestocks = async (pageNumber: number, search: string, species: string, status: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getLivestocks(
                pageNumber, 
                20, 
                search, 
                species === 'ALL' ? undefined : species, 
                status === 'ALL' ? undefined : status
            );
            setLivestocks(data.items || []);
            setTotalPages(data.totalPages || 1);
            setPage(data.page || 1);
        } catch (err: any) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            fetchLivestocks(page, searchQuery, speciesFilter, statusFilter);
        }, 300);
        return () => clearTimeout(handler);
    }, [refresh, page, searchQuery, speciesFilter, statusFilter]);

    const handleRetry = () => {
        fetchLivestocks(page, searchQuery, speciesFilter, statusFilter);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setPage(1);
    };

    const handleSpeciesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSpeciesFilter(e.target.value);
        setPage(1);
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatusFilter(e.target.value);
        setPage(1);
    };

    if (error) {
        return (
            <ErrorState 
                title={t('common:errors.title', { defaultValue: 'Error' })}
                message={error.message || t('animals:form.errors.serverError')}
                onRetry={handleRetry}
            />
        );
    }

    if (!loading && livestocks.length === 0) {
        return (
            <div className="livestock-container">
                <div className="livestock-header">
                    <h2>{t('animals:directory')}</h2>
                </div>
                <EmptyState 
                    title={t('animals:list.noAnimals')}
                    description={t('animals:empty.noLivestock')}
                    action={<Button onClick={() => navigate('/livestock/add')}>{t('animals:add')}</Button>}
                />
            </div>
        );
    }

    return (
        <div className="livestock-container">
            <div className="livestock-header">
                <h2>{t('animals:directory')}</h2>
            </div>

            <div className="livestock-filters">
                <Input
                    placeholder={t('animals:list.searchPlaceholder')}
                    value={searchQuery}
                    onChange={handleSearchChange}
                    leftIcon={<Search size={18} />}
                    style={{ marginBottom: 0 }}
                />
                <Select
                    value={speciesFilter}
                    onChange={handleSpeciesChange}
                >
                    <option value="ALL">{t('animals:list.allSpecies')}</option>
                    {LIVESTOCK_SPECIES.map(species => (
                        <option key={species} value={species}>{t(`animals:species.${species.toLowerCase()}`, { defaultValue: species })}</option>
                    ))}
                </Select>
                <Select
                    value={statusFilter}
                    onChange={handleStatusChange}
                >
                    <option value="ALL">{t('animals:list.allStatuses')}</option>
                    {LIVESTOCK_STATUSES.map(status => (
                        <option key={status} value={status}>{t(`animals:status.${status.toLowerCase()}`, { defaultValue: status })}</option>
                    ))}
                </Select>
            </div>

            {loading ? (
                <div className="livestock-grid">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <Card key={i}>
                            <Card.Header>
                                <Skeleton width="40%" height="1.5rem" />
                            </Card.Header>
                            <Card.Body>
                                <div className="livestock-card__meta">
                                    <Skeleton width="100%" height="1rem" />
                                    <Skeleton width="100%" height="1rem" />
                                    <Skeleton width="50%" height="1.5rem" style={{ marginTop: '0.5rem' }} />
                                </div>
                            </Card.Body>
                            <Card.Footer>
                                <Skeleton width="100%" height="2.5rem" />
                            </Card.Footer>
                        </Card>
                    ))}
                </div>
            ) : livestocks.length === 0 ? (
                <EmptyState 
                    title={t('animals:list.noResults')}
                    description={t('animals:empty.noLivestock')}
                    action={
                        <Button 
                            variant="secondary"
                            onClick={() => {
                                setSearchQuery('');
                                setSpeciesFilter('ALL');
                                setStatusFilter('ALL');
                                setPage(1);
                            }}
                        >
                            {t('common:actions.cancel', { defaultValue: 'Clear Filters' })}
                        </Button>
                    }
                />
            ) : (
                <>
                    <div className="livestock-grid">
                        {livestocks.map(animal => (
                            <Card key={animal.id}>
                                <Card.Header 
                                    title={animal.name ? `${animal.name} (${animal.tagNumber})` : animal.tagNumber} 
                                />
                                <Card.Body>
                                    <div className="livestock-card__meta">
                                        <div className="livestock-card__meta-row">
                                            <span className="livestock-card__meta-label">{t('animals:fields.speciesLabel')}</span>
                                            <span className="livestock-card__meta-value">
                                                {t(`animals:species.${animal.species?.toLowerCase()}`, { defaultValue: animal.species })}
                                            </span>
                                        </div>
                                        {animal.breed && (
                                            <div className="livestock-card__meta-row">
                                                <span className="livestock-card__meta-label">{t('animals:fields.breedLabel')}</span>
                                                <span className="livestock-card__meta-value">{animal.breed}</span>
                                            </div>
                                        )}
                                        <div className="livestock-card__meta-row">
                                            <span className="livestock-card__meta-label">{t('animals:fields.genderLabel')}</span>
                                            <span className="livestock-card__meta-value">
                                                {t(`animals:gender.${animal.gender?.toLowerCase()}`, { defaultValue: animal.gender })}
                                            </span>
                                        </div>
                                        <div style={{ marginTop: 'var(--space-2)' }}>
                                            <Badge variant={getStatusVariant(animal.status || 'Active')}>
                                                {t(STATUS_I18N_MAP[animal.status || 'Active'] || (animal.status || 'Active') as any)}
                                            </Badge>
                                        </div>
                                    </div>
                                </Card.Body>
                                <Card.Footer>
                                    <Button 
                                        variant="ghost" 
                                        onClick={() => navigate(`/livestock/${animal.id}`)}
                                        style={{ width: '100%' }}
                                    >
                                        {t('animals:list.viewProfile')}
                                    </Button>
                                </Card.Footer>
                            </Card>
                        ))}
                    </div>
                    
                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-4)', marginTop: 'var(--space-6)' }}>
                            <Button 
                                variant="secondary" 
                                disabled={page === 1} 
                                onClick={() => setPage(p => p - 1)}
                            >
                                {t('common:actions.previous', { defaultValue: 'Previous' })}
                            </Button>
                            <div style={{ display: 'flex', alignItems: 'center', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                                {page} / {totalPages}
                            </div>
                            <Button 
                                variant="secondary" 
                                disabled={page === totalPages} 
                                onClick={() => setPage(p => p + 1)}
                            >
                                {t('common:actions.next', { defaultValue: 'Next' })}
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default LivestockList;
