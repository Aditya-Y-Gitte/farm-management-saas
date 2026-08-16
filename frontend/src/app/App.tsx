import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../features/auth/context/AuthContext';
import ProtectedRoute from '../features/auth/components/ProtectedRoute';
import AppShell from '../components/layout/AppShell';
import LoginPage from '../features/auth/pages/LoginPage';
import { Skeleton } from '../components/ui/Skeleton';
import './App.css';

// Lazy load major feature pages
const DashboardPage = lazy(() => import('../features/dashboard/pages/DashboardPage'));
const LivestockPage = lazy(() => import('../features/livestock/pages/LivestockPage'));
const AddLivestockPage = lazy(() => import('../features/livestock/pages/AddLivestockPage'));
const AddBreedingRecordPage = lazy(() => import('../features/breeding/pages/AddBreedingRecordPage'));
const EditBreedingRecordPage = lazy(() => import('../features/breeding/pages/EditBreedingRecordPage'));
const AddHealthRecordPage = lazy(() => import('../features/health/pages/AddHealthRecordPage'));
const GlobalAddHealthRecordPage = lazy(() => import('../features/health/pages/GlobalAddHealthRecordPage'));
const DairyPage = lazy(() => import('../features/dairy/pages/DairyPage'));
const AddDairyRecordPage = lazy(() => import('../features/dairy/pages/AddDairyRecordPage'));
const LivestockProfilePage = lazy(() => import('../features/livestock/pages/LivestockProfilePage'));
const FinancePage = lazy(() => import('../features/finance/pages/FinancePage'));
const FeedPage = lazy(() => import('../features/feed/pages/FeedPage'));
const FeedAddPage = lazy(() => import('../features/feed/pages/FeedAddPage'));

const PageSuspenseFallback = () => (
    <div className="page" style={{ padding: 'var(--space-xl)' }}>
        <div className="page__header" style={{ marginBottom: 'var(--space-xl)' }}>
            <Skeleton width="200px" height="32px" />
        </div>
        <div className="glass-card" style={{ padding: 'var(--space-xl)' }}>
            <Skeleton width="100%" height="200px" />
        </div>
    </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes inside AppShell layout */}
            <Route
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Suspense fallback={<PageSuspenseFallback />}><DashboardPage /></Suspense>} />
            <Route path="/livestock" element={<Suspense fallback={<PageSuspenseFallback />}><LivestockPage /></Suspense>} />
            <Route path="/livestock/add" element={<Suspense fallback={<PageSuspenseFallback />}><AddLivestockPage /></Suspense>} />
            <Route path="/livestock/:id" element={<Suspense fallback={<PageSuspenseFallback />}><LivestockProfilePage /></Suspense>} />
            <Route path="/livestock/:id/breeding/add" element={<Suspense fallback={<PageSuspenseFallback />}><AddBreedingRecordPage /></Suspense>} />
            <Route path="/livestock/:id/breeding/:cycleId/edit" element={<Suspense fallback={<PageSuspenseFallback />}><EditBreedingRecordPage /></Suspense>} />
            <Route path="/livestock/:id/health/add" element={<Suspense fallback={<PageSuspenseFallback />}><AddHealthRecordPage /></Suspense>} />
            <Route path="/health/record" element={<Suspense fallback={<PageSuspenseFallback />}><GlobalAddHealthRecordPage /></Suspense>} />
            <Route path="/dairy" element={<Suspense fallback={<PageSuspenseFallback />}><DairyPage /></Suspense>} />
            <Route path="/dairy/record" element={<Suspense fallback={<PageSuspenseFallback />}><AddDairyRecordPage /></Suspense>} />
            <Route path="/finances" element={<Suspense fallback={<PageSuspenseFallback />}><FinancePage /></Suspense>} />
            <Route path="/feed" element={<Suspense fallback={<PageSuspenseFallback />}><FeedPage /></Suspense>} />
            <Route path="/feed/add" element={<Suspense fallback={<PageSuspenseFallback />}><FeedAddPage /></Suspense>} />
          </Route>

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
