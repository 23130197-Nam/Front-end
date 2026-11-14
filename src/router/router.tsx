import { createBrowserRouter } from 'react-router-dom';
import App from '../App';

import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ChatPage from '../pages/ChatPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <LoginPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'chat',
        element: <ChatPage />,
      },
      {
        path: '*',
        element: <div className="text-center p-5"><h3>404 - Không tìm thấy trang</h3></div>,
      },
    ],
  },
]);