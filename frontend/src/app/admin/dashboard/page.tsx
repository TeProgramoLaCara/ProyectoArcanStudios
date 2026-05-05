'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  getDashboardData,
  type DashboardApiData,
} from '@/services/dashboard.service';

import AcademicOperationPanel from '@/components/dashboard/AcademicOperationPanel';
import CompaniesPanel from '@/components/dashboard/CompaniesPanel';
import CoursesPanel from '@/components/dashboard/CoursesPanel';
import DashboardHero from '@/components/dashboard/DashboardHero';
import DashboardMetricsGrid from '@/components/dashboard/DashboardMetricsGrid';
import DashboardState from '@/components/dashboard/DashboardState';
import ProfessorsPanel from '@/components/dashboard/ProfessorsPanel';
import RecentReservationsPanel from '@/components/dashboard/RecentReservationsPanel';

import {
  buildDashboardViewModel,
  EMPTY_DASHBOARD_DATA,
} from '@/components/dashboard/dashboard.mapper';

export default function Page() {
  const [dashboardData, setDashboardData] =
    useState<DashboardApiData>(EMPTY_DASHBOARD_DATA);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const viewModel = useMemo(
    () => buildDashboardViewModel(dashboardData),
    [dashboardData]
  );

  useEffect(() => {
    getDashboardData()
      .then((data) => {
        setDashboardData(data);
        setError(null);
      })
      .catch((error) => {
        console.error('Error cargando dashboard:', error);
        setError('No se pudieron cargar los datos del dashboard.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <DashboardState
        type="loading"
        message="Cargando datos del dashboard..."
      />
    );
  }

  if (error) {
    return <DashboardState type="error" message={error} />;
  }

  return (
    <section className="bg-background p-6">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-8">
        <DashboardHero totals={viewModel.totals} />

        <DashboardMetricsGrid metrics={viewModel.metrics} />

        <div className="h-px rounded-full bg-linear-to-r from-transparent via-[#267F6B]/45 to-transparent" />

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.45fr_1fr]">
          <RecentReservationsPanel reservas={viewModel.recentReservas} />
          <AcademicOperationPanel viewModel={viewModel} />
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <CoursesPanel courses={viewModel.courseDemand} />
          <CompaniesPanel companies={viewModel.companySummary} />
          <ProfessorsPanel professors={viewModel.professorLoad} />
        </div>
      </div>
    </section>
  );
}