import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRoutes } from "./routes";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {publicRoutes.map((route, index) => {
            const Layout = route.layout || MainLayout;
            
            if (route.children) {
              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    route.protected ? (
                      <ProtectedRoute>
                        <Layout />
                      </ProtectedRoute>
                    ) : (
                      <Layout />
                    )
                  }
                >
                  {route.children.map((childRoute, childIndex) => (
                    <Route
                      key={`${index}-${childIndex}`}
                      path={childRoute.path}
                      element={<childRoute.component />}
                    />
                  ))}
                </Route>
              );
            }

            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout>
                    {route.protected ? (
                      <ProtectedRoute>
                        <route.component />
                      </ProtectedRoute>
                    ) : (
                      <route.component />
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