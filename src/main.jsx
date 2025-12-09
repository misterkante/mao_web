import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { StrictMode } from "react";

import { AuthProvider } from './contexts/AuthContext.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
// import ProfilePage from './pages/ProfilePage.jsx';
import ProfilePage from "./pages/user/ProfilPage.jsx";
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ProtectedAdminRoute from './components/ProtectedAdminRoute.jsx';
import Layout from './components/Layout.jsx';
import './index.css';
import QRCodeScanner from "./pages/QRCodeScanner.jsx";
import QRGeneratorPage from "./pages/QRGeneratorPage.jsx";
import SubscriptionPage from "./pages/SubscriptionPage.jsx";
import ChatbotContainer from "./components/chat/ChatbotContainer.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import NotFound from "./pages/NotFound.jsx";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      }, 
      {
        path: "/subscription",
        element: <SubscriptionPage />,
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      //  {
      //   path: "/mine",
      //   element: (
      //     <ProtectedRoute>
      //       <UserProfile />
      //     </ProtectedRoute>
      //   ),
      // },
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedAdminRoute>
        <AdminDashboard />
      </ProtectedAdminRoute>
    ),
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/scanner",
    element: <QRCodeScanner />,
  },
  {
    path: "/generator",
    element: <QRGeneratorPage />,
  },
  {
    path: "/chat/:id",
    element: <ChatbotContainer />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
