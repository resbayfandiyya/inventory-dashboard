import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "../pages/login";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import Inventory from "../pages/Inventory";
import Sales from "../pages/Sales";
import Profile from "../pages/Profile";
import Analytics from "../pages/Analytics";

import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import RoleRoute from "./RoleRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/users"
            element={
              <RoleRoute roles={["Admin"]}>
                <Users />
              </RoleRoute>
            }
          />
          <Route
            path="/inventory"
            element={<Inventory />}
          />

          <Route
            path="/sales"
            element={<Sales />}
          />

          <Route
            path="/analytics"
            element={<Analytics />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}