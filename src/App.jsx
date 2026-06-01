import { BrowserRouter, Routes, Route } from "react-router-dom";
import MadeByManyPage    from "@/pages/MadeByManyPage";
import NotFoundPage      from "@/pages/NotFoundPage";
import AdminPage         from "@/pages/AdminPage";
import MediaLibraryPage  from "@/pages/MediaLibraryPage";
import LoginPage         from "@/pages/LoginPage";
import ProtectedRoute    from "@/components/auth/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/login"      element={<LoginPage />} />
        <Route path="/admin"      element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
        <Route path="/media"      element={<ProtectedRoute><MediaLibraryPage /></ProtectedRoute>} />
        <Route path="/:orderId"   element={<MadeByManyPage />} />
        <Route path="/"           element={<MadeByManyPage />} />
        <Route path="*"           element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
