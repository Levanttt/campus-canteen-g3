import { Link, Route, Routes } from 'react-router-dom';
import CustomerPage from './pages/CustomerPage.jsx';
import TenantPage from './pages/TenantPage.jsx';

export default function App() {
  return (
    <>
      <nav className="app-nav">
        <Link to="/">Menu Pelanggan</Link>
        <Link to="/tenant">Dashboard Tenant</Link>
      </nav>
      <Routes>
        <Route path="/" element={<CustomerPage />} />
        <Route path="/tenant" element={<TenantPage />} />
      </Routes>
    </>
  );
}
