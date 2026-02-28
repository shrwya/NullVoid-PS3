import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "../components/ProtectedRoute";
import Home from "../pages/Home";
import RoleRedirect from "./RoleRedirect";


import OwnerDashboard from "../pages/owner/OwnerDashboard";
import SalesPortal from "../pages/sales/SalesPortal";

import KitchenPortal from "../pages/kitchen/KitchenPortal";
import InventoryPortal from "../pages/inventory/InventoryPortal";
import PropertyPortal from "../pages/property/PropertyPortal";
import VendorPortal from "../pages/vendor/VendorPortal";
import FinancePortal from "../pages/finance/FinancePortal";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* 🔥 AUTO ROLE REDIRECT */}
      <Route path="/dashboard" element={<RoleRedirect />} />

      <Route
        path="/owner"
        element={
          <ProtectedRoute role="owner">
            <OwnerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/sales"
        element={
          <ProtectedRoute role="sales">
            <SalesPortal />
          </ProtectedRoute>
        }
      />

      <Route
        path="/kitchen"
        element={
          <ProtectedRoute role="kitchen">
            <KitchenPortal />
          </ProtectedRoute>
        }
      />

      <Route
        path="/inventory"
        element={
          <ProtectedRoute role="inventory">
            <InventoryPortal />
          </ProtectedRoute>
        }
      />

      <Route
        path="/property"
        element={
          <ProtectedRoute role="property">
            <PropertyPortal />
          </ProtectedRoute>
        }
      />

      <Route
        path="/vendor"
        element={
          <ProtectedRoute role="vendor">
            <VendorPortal />
          </ProtectedRoute>
        }
      />

      <Route
        path="/finance"
        element={
          <ProtectedRoute role="finance">
            <FinancePortal />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}