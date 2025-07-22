import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import SignupPage from './components/SignUpPage';
import ResetPassword from './components/ResetPassword';
import NewUser from './components/NewUser';
import ClientPage from './components/ClientPage';
import ProtectedRoute from './components/ProtectedRoute';
import ClientManagement from './components/ClientManagement';
import Layout from './components/Layout'; // ✅ Import shared layout
import AddClientForm from './components/AddClientForm';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/reset" element={<ResetPassword />} />
          <Route path="/newuser" element={<NewUser />} />

          {/* Protected Routes with shared layout */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/clients"
            element={
              <ProtectedRoute>
                <Layout>
                  <ClientPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/clients/manage"
            element={
              <ProtectedRoute>
                <Layout>
                  <ClientManagement />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/clients/add"
            element={
              <ProtectedRoute>
                <Layout>
                  <AddClientForm />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
