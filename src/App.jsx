import { BrowserRouter, Routes, Route } from "react-router-dom";
import MadeByManyPage from "@/pages/MadeByManyPage";
import NotFoundPage   from "@/pages/NotFoundPage";

/**
 * App
 *
 * Routes:
 *   /              → MadeByManyPage  (uses ?orderId= query param)
 *   /order/:orderId → MadeByManyPage  (uses dynamic URL segment)
 *   *              → NotFoundPage
 */
export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/:orderId"   element={<MadeByManyPage />} />
        <Route path="/"           element={<MadeByManyPage />} />
        <Route path="*"           element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
