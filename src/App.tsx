import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { CityIntelligencePage } from './pages/CityIntelligencePage';
import { TrafficPage } from './pages/TrafficPage';
import { PollutionPage } from './pages/PollutionPage';
import { WaterPage } from './pages/WaterPage';
import { WeatherPage } from './pages/WeatherPage';
import { PopulationPage } from './pages/PopulationPage';
import { HealthcarePage } from './pages/HealthcarePage';
import { InfrastructurePage } from './pages/InfrastructurePage';
import { AiInsightsPage } from './pages/AiInsightsPage';
import { WhatIfSimulatorPage } from './pages/WhatIfSimulatorPage';
import { InterventionPlannerPage } from './pages/InterventionPlannerPage';
import { BudgetOptimizerPage } from './pages/BudgetOptimizerPage';
import { ReportsPage } from './pages/ReportsPage';
import { DataSourcesPage } from './pages/DataSourcesPage';
import { UserManagementPage } from './pages/UserManagementPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AuthPortalPage } from './pages/AuthPortalPage';

// Portal App Layout Wrapper
const PortalLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  return (
    <div className="flex min-h-screen bg-[#070A11] text-[#F3F4F6]">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Default Opening: Create Account & Login Portal */}
          <Route path="/" element={<AuthPortalPage defaultTab="login" />} />
          <Route path="/login" element={<AuthPortalPage defaultTab="login" />} />
          <Route path="/register" element={<AuthPortalPage defaultTab="register" />} />
          <Route path="/landing" element={<LandingPage />} />

          {/* Portal Modules with Sidebar and Navbar */}
          <Route
            path="/dashboard"
            element={
              <PortalLayout>
                <DashboardPage />
              </PortalLayout>
            }
          />
          <Route
            path="/cities"
            element={
              <PortalLayout>
                <CityIntelligencePage />
              </PortalLayout>
            }
          />
          <Route
            path="/traffic"
            element={
              <PortalLayout>
                <TrafficPage />
              </PortalLayout>
            }
          />
          <Route
            path="/pollution"
            element={
              <PortalLayout>
                <PollutionPage />
              </PortalLayout>
            }
          />
          <Route
            path="/water"
            element={
              <PortalLayout>
                <WaterPage />
              </PortalLayout>
            }
          />
          <Route
            path="/weather"
            element={
              <PortalLayout>
                <WeatherPage />
              </PortalLayout>
            }
          />
          <Route
            path="/population"
            element={
              <PortalLayout>
                <PopulationPage />
              </PortalLayout>
            }
          />
          <Route
            path="/healthcare"
            element={
              <PortalLayout>
                <HealthcarePage />
              </PortalLayout>
            }
          />
          <Route
            path="/infrastructure"
            element={
              <PortalLayout>
                <InfrastructurePage />
              </PortalLayout>
            }
          />
          <Route
            path="/ai-insights"
            element={
              <PortalLayout>
                <AiInsightsPage />
              </PortalLayout>
            }
          />
          <Route
            path="/simulator"
            element={
              <PortalLayout>
                <WhatIfSimulatorPage />
              </PortalLayout>
            }
          />
          <Route
            path="/interventions"
            element={
              <PortalLayout>
                <InterventionPlannerPage />
              </PortalLayout>
            }
          />
          <Route
            path="/budget-optimizer"
            element={
              <PortalLayout>
                <BudgetOptimizerPage />
              </PortalLayout>
            }
          />
          <Route
            path="/reports"
            element={
              <PortalLayout>
                <ReportsPage />
              </PortalLayout>
            }
          />
          <Route
            path="/data-sources"
            element={
              <PortalLayout>
                <DataSourcesPage />
              </PortalLayout>
            }
          />
          <Route
            path="/admin/users"
            element={
              <PortalLayout>
                <UserManagementPage />
              </PortalLayout>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
