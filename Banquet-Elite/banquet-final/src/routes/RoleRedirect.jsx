import React from "react";
import { Navigate } from "react-router-dom";

export default function RoleRedirect() {
  const role = localStorage.getItem("role");

  const roleRoutes = {
    owner: "/owner",
    sales: "/sales",
    kitchen: "/kitchen",
    inventory: "/inventory",
    property: "/property",
    vendor: "/vendor",
    finance: "/finance",
  };

  return <Navigate to={roleRoutes[role] || "/"} replace />;
}