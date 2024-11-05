import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRoutes } from "./routes";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {publicRoutes.map((route, index) => {
            const Layout = route.layout || MainLayout; // Sử dụng layout mặc định là MainLayout
            const Page = route.component; // Lấy component từ route

            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout>
                    {route.protected ? ( // Kiểm tra nếu route cần được bảo vệ
                      <ProtectedRoute>
                        <Page />
                      </ProtectedRoute>
                    ) : (
                      <Page />
                    )}
                  </Layout>
                }
              />
            );
          })}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
