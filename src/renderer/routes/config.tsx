import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const Login = lazy(() => import('@renderer/pages/login/index'));
const Layout = lazy(() => import('@renderer/pages/layout/index'));
const Page1 = lazy(() => import('@renderer/pages/page1/index'));
const Page2 = lazy(() => import('@renderer/pages/page2/index'));

const routes = (role?: number) => [
  {
    path: '/',
    element: role ? <Layout /> : <Navigate to="/login" />,
    children: [
      { path: '/', element: <Navigate to="/page1" /> },
      { path: '/page1', element: <Page1 /> },
      { path: '/page2', element: <Page2 /> },
      // {
      //   path: 'member',
      //   element: <Outlet />,
      //   children: [
      //     { path: '/', element: <MemberGrid /> },
      //     { path: '/add', element: <AddMember /> },
      //   ],
      // },
    ],
  },
  {
    path: '/login',
    element: role ? <Navigate to="/" /> : <Login />,
  },
];

export default routes;
