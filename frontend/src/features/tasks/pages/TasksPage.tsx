import React from 'react';
import { useTranslation } from 'react-i18next';
import { EmptyState } from '../../../components/ui/EmptyState';
import { CheckSquare } from 'lucide-react';
import '../../../theme/PageCommon.css';

const TasksPage: React.FC = () => {
    const { t } = useTranslation(['common', 'navigation']);

    return (
        <div className="page">
            <div className="page__header">
                <h1>✓ {t('navigation:tasks')}</h1>
            </div>

            <div className="glass-card" style={{ padding: 'var(--space-2xl) var(--space-xl)', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <EmptyState
                    icon={<CheckSquare size={48} />}
                    title={t('navigation:tasks')}
                    description="This feature is planned for a future release. Task management will allow you to assign daily duties and track farm operations."
                />
            </div>
        </div>
    );
};

export default TasksPage;
