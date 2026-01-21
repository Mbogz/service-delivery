import { BrowserRouter, Route, Routes } from "react-router-dom";
import SessionContextProvider from "./providers/useSession";
import HomePage from "./pages/Homepage";
import LoginPage from "./pages/LoginPage";
import { Toaster } from "react-hot-toast";
import DashboardPage from "./pages/Dashboard";
import AppLayout from "./pages/AppLayout";
import ServiceProvidersPage from "./pages/ServiceProviders";
import ProtectedRoute from "./components/ProtectedRoute";
import { ChakraProvider } from "@chakra-ui/react";
import AddServiceProvider from "./pages/AddServiceProvider";
import SubCategoriesContextProvider from "./providers/useSubCategories";
import Bookings from "./pages/Bookings";
import CategoriesPage from "./pages/Categories";
import CategoriesContextProvider from "./providers/useCategories";
import ServiceProvidersContextProvider from "./providers/useServiceProviders";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import OrderPage from "./pages/Orders";

const queryClient = new QueryClient();
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <SessionContextProvider>
          <CategoriesContextProvider>
            <SubCategoriesContextProvider>
              <ServiceProvidersContextProvider>
                <BrowserRouter>
                  <Routes>
                    <Route index element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                      path="app"
                      element={
                        <ProtectedRoute>
                          <AppLayout />
                        </ProtectedRoute>
                      }
                    >
                      <Route path="dashboard" element={<DashboardPage />} />
                      <Route path="service-providers">
                        <Route
                          path=""
                          index
                          element={<ServiceProvidersPage />}
                        />
                        <Route path="add" element={<AddServiceProvider />} />
                      </Route>
                      <Route path="bookings">
                        <Route path="" index element={<Bookings />} />
                      </Route>
                      <Route path="categories">
                        <Route path="" index element={<CategoriesPage />} />
                      </Route>
                      <Route path="orders">
                        <Route path="" index element={<OrderPage />} />
                      </Route>
                    </Route>
                  </Routes>
                </BrowserRouter>
                <Toaster position="top-center" />
              </ServiceProvidersContextProvider>
            </SubCategoriesContextProvider>
          </CategoriesContextProvider>
        </SessionContextProvider>
      </ChakraProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}