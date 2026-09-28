import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PublicLayout } from './PublicLayout';
import { Home } from '../routes/Home';
import { Directory } from '../routes/Directory';
import { Profile } from '../routes/Profile';
import { HowItWorks } from '../routes/HowItWorks';
import { External } from '../routes/External';
import { NotFound } from '../routes/NotFound';
import { AdminLayout } from '../routes/admin/AdminLayout';
import { Overview } from '../routes/admin/Overview';
import { Records } from '../routes/admin/Records';
import { EditRecord } from '../routes/admin/EditRecord';
import { Import } from '../routes/admin/Import';

export const router = createBrowserRouter([
  // Public Site Routes
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'find-a-dentist', element: <Directory /> },
      { path: 'dentist/:slug', element: <Profile /> },
      { path: 'how-it-works', element: <HowItWorks /> },
      { path: 'demo/external/:host', element: <External /> },
      { path: '*', element: <NotFound /> },
    ],
  },
  // WordPress Admin Suite Routes
  {
    path: '/wp-admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <Overview /> },
      { path: 'records', element: <Records /> },
      { path: 'records/new', element: <EditRecord /> },
      { path: 'records/:uid', element: <EditRecord /> },
      { path: 'import', element: <Import /> },
      { path: '*', element: <Navigate to="/wp-admin" replace /> },
    ],
  },
]);
