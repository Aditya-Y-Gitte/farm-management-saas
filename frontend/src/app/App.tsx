import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../features/auth/context/AuthContext';
import ProtectedRoute from '../features/auth/components/ProtectedRoute';
import AppShell from '../components/layout/AppShell';
import LoginPage from '../features/auth/pages/LoginPage';
import DashboardPage from '../features/dashboard/pages/DashboardPage';
import LivestockPage from '../features/livestock/pages/LivestockPage';
import AddLivestockPage from '../features/livestock/pages/AddLivestockPage';
import AddBreedingRecordPage from '../features/breeding/pages/AddBreedingRecordPage';
import EditBreedingRecordPage from '../features/breeding/pages/EditBreedingRecordPage';
import AddHealthRecordPage from '../features/health/pages/AddHealthRecordPage';
import DairyPage from '../features/dairy/pages/DairyPage';
import AddDairyRecordPage from '../features/dairy/pages/AddDairyRecordPage';
import LivestockProfilePage from '../features/livestock/pages/LivestockProfilePage';
import FinancePage from '../features/finance/pages/FinancePage';
import FeedPage from '../features/feed/pages/FeedPage';
import FeedAddPage from '../features/feed/pages/FeedAddPage';
import './App.css';

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
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/livestock" element={<LivestockPage />} />
            <Route path="/livestock/add" element={<AddLivestockPage />} />
            <Route path="/livestock/:id" element={<LivestockProfilePage />} />
            <Route path="/livestock/:id/breeding/add" element={<AddBreedingRecordPage />} />
            <Route path="/livestock/:id/breeding/:cycleId/edit" element={<EditBreedingRecordPage />} />
            <Route path="/livestock/:id/health/add" element={<AddHealthRecordPage />} />
            <Route path="/dairy" element={<DairyPage />} />
            <Route path="/dairy/record" element={<AddDairyRecordPage />} />
            <Route path="/finances" element={<FinancePage />} />
            <Route path="/feed" element={<FeedPage />} />
            <Route path="/feed/add" element={<FeedAddPage />} />
          </Route>

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
