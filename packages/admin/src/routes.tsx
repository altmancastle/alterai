import { BrowserRouter, Route, Routes } from 'react-router';
import Dashboard from './routes/Dashboard';
import Models from './routes/Models';
import Analytics from './routes/Analytics';
import Login from './routes/Login';
import ModelList from './routes/Models/ModelList';
import UploadModel from './routes/Models/UploadModel';
import ModelDetail from './routes/Models/ModelDetail';
import DataOverview from './routes/Analytics/DataOverview';
import DataDetail from './routes/Analytics/DataDetail';
import Chat from './routes/Chat';
import Settings from './routes/Settings';
import UserManagement from './routes/Settings/UserManagement';
import ApiKeyManagement from './routes/Settings/ApiKeyManagement';
import SystemLogs from './routes/Settings/SystemLogs';
import Notifications from './routes/Notifications';
import Help from './routes/Help';
import Register from './routes/Register';
import HistoryChat from './routes/Chat/HistoryChat';
import CollectChat from './routes/Chat/CollectChat';
import AuthLayout from './core/layout/AuthLayout';
import BaseLayout from './core/layout/BaseLayout';

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="help" element={<Help />} />
        <Route element={<BaseLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="models" element={<AuthLayout />}>
            <Route index element={<Models />} />
            <Route path="list" element={<ModelList />} />
            <Route path="upload" element={<UploadModel />} />
            <Route path=":id" element={<ModelDetail />} />
          </Route>

          <Route path="analytics">
            <Route index element={<Analytics />} />
            <Route path="overview" element={<DataOverview />} />
            <Route path=":id" element={<DataDetail />} />
          </Route>

          <Route path="chat">
            <Route index element={<Chat />} />
            <Route path="history" element={<HistoryChat />} />
            <Route path="collect" element={<CollectChat />} />
          </Route>

          <Route path="settings" element={<AuthLayout />}>
            <Route index element={<Settings />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="api-keys" element={<ApiKeyManagement />} />
            <Route path="logs" element={<SystemLogs />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}