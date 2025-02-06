import { createBrowserRouter } from 'react-router';
import Dashboard from './routes/Dashboard';
import Models from './routes/Models';
import Analytics from './routes/Analytics';
import Chat from './routes/Chat';
import Settings from './routes/Settings';
import Notifications from './routes/Notifications';
import Help from './routes/Help';
import Login from './routes/Login';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <Dashboard />,
  },
  {
    path: '/models',
    element: <Models />,
    children: [
      { path: 'list', element: <ModelList /> },
      { path: 'upload', element: <UploadModel /> },
      { path: ':id', element: <ModelDetail /> },
    ],
  },
  {
    path: '/analytics',
    element: <Analytics />,
    children: [
      { path: 'overview', element: <DataOverview /> },
      { path: ':id', element: <DataDetail /> },
    ],
  },
  {
    path: '/chat',
    element: <Chat />,
  },
  {
    path: '/settings',
    element: <Settings />,
    children: [
      { path: 'users', element: <UserManagement /> },
      { path: 'api-keys', element: <ApiKeyManagement /> },
      { path: 'logs', element: <SystemLogs /> },
    ],
  },
  {
    path: '/notifications',
    element: <Notifications />,
  },
  {
    path: '/help',
    element: <Help />,
  },
]);