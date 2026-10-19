import { Link, Route, Routes } from 'react-router-dom';
import CustomerPage from './pages/CustomerPage.jsx';

export default function App() {
  return (
    <>
      <nav className="app-nav">
        <Link to="/">Menu Pelanggan</Link>
        <Link to="/tenant">Dashboard Tenant</Link>
      </nav>
      <Routes>
        <Route path="/" element={<CustomerPage />} />
        <Route
          path="/tenant"
          element={
            <main className="app-shell">
              <div className="panel">
                <h2>Dasbor Tenant</h2>
                <div className="empty-state">
                  Antrean pesanan realtime akan diimplementasikan pada branch <strong>US-3.1</strong>.
                </div>
              </div>
            </main>
          }
        />
      </Routes>
    </>
  );
}

