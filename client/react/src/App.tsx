import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GuestInvite    from './pages/GuestInvite';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/invite/:token" element={<GuestInvite />} />
        <Route path="/admin"         element={<AdminDashboard />} />
        <Route path="*" element={
          <div className="min-h-screen bg-sky-50 flex items-center justify-center">
            <div className="text-center">
              <p className="text-4xl mb-4">✝</p>
              <h1 className="text-slate-700 text-xl font-medium mb-2">
                Emmette Zion Gabriel Amorsolo
              </h1>
              <p className="text-slate-500 text-sm">Holy Baptism — May 3, 3:30 PM</p>
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}
