import { Suspense, lazy } from 'react';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router';
import LoadingView from './LoadingView';
import FatalError from './FatalErrorBoundary';
import Footer from './Footer';
import WithPagedTitle from './WithPagedTitle';
import WordCountingHome from '../../slices/wordCounting/WordCountingHome';
const PrivacyHome = lazy(() => import(/* webpackChunkName: "bundler-privacy" */ '../../slices/privacy/PrivacyHome'));
const LegalNoticesHome = lazy(() => import(/* webpackChunkName: "bundler-legal-notices" */ '../../slices/legalNotices/LegalNoticesHome'));

import './App.css';

function AppLayout() {
  return (
    <>
      <Outlet />
      <Footer />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    Component: AppLayout,
    ErrorBoundary: FatalError,
    children: [
      { index: true, element: (<WithPagedTitle><WordCountingHome /></WithPagedTitle>) },
      { path: 'privacy', element: (
        <Suspense fallback={<LoadingView />}>
          <WithPagedTitle pageTitle="Vie privée"><PrivacyHome /></WithPagedTitle>
        </Suspense>
      ) },
      { path: 'legal-notices', element: (
        <Suspense fallback={<LoadingView />}>
          <WithPagedTitle pageTitle="Mentions légales"><LegalNoticesHome /></WithPagedTitle>
        </Suspense>
      ) },
    ],
  },
], {
  basename: APP_ENV_APP_PUBLIC_PATH,
});

export default function App() {
  return (<RouterProvider router={router} />);
}
