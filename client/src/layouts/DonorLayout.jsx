import React, { useEffect, useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  Avatar,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";

import {
  Dashboard as DashboardIcon,
  History as HistoryIcon,
  Edit as EditIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Favorite as FavoriteIcon,
  MenuBook as MenuBookIcon,
} from "@mui/icons-material";

import { getMe } from "../services/auth";

const drawerWidth = 290;
const headerHeight = 100;

const menuItems = [
  { label: "Dashboard", path: "/DonorDashboard", icon: <DashboardIcon /> },
  { label: "Donation History", path: "/donor/history", icon: <HistoryIcon /> },
  { label: "Donate", path: "/Donate", icon: <FavoriteIcon /> },
  { label: "News & Stories", path: "/Donor/NewsStories", icon: <MenuBookIcon /> },
  { label: "Edit Profile", path: "/donor/edit-profile", icon: <EditIcon /> },
  { label: "Settings", path: "/donor/settings", icon: <SettingsIcon /> },
  { label: "Logout", path: "/donor/logout", icon: <LogoutIcon /> },
];

export default function DonorLayout() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const storedRole = localStorage.getItem("role");
        // If client role is not donor, force logout/redirect
        if (!storedRole || storedRole !== "donor") {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          navigate("/donor/login");
          return;
        }

        const me = await getMe();
        // If token belongs to another role (admin/needy), clear and redirect
        if (!me || me.role !== "donor") {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          navigate("/donor/login");
          return;
        }

        setUser(me);
      } catch (err) {
        console.error("Failed to load donor", err);
      }
    })();
  }, [navigate]);

  const isActive = (path) => {
    if ((location.pathname === "/donor" || location.pathname === "/donor/") && path === "/DonorDashboard") {
      return true;
    }
    return location.pathname === path;
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* ===== SIDEBAR ===== */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#f7f7f7",
            borderRight: "1px solid rgba(0,0,0,0.08)",
            top: headerHeight,
            height: `calc(100% - ${headerHeight}px)`,
          },
        }}
      >
        {/* ===== PROFILE ===== */}
        <Box sx={{ p: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Avatar
            src={user?.avatar || "/assets/user.png"}
            alt={`${user?.firstName || ""} ${user?.lastName || ""}`}
            sx={{ width: 70, height: 70, bgcolor: "#e0e0e0" }}
          />
          <Typography sx={{ mt: 1, fontWeight: 700 }}>
            {user ? `${user.firstName} ${user.lastName}` : "Loading..."}
          </Typography>
          <Typography variant="caption" sx={{ color: "gray" }}>( DONOR )</Typography>
        </Box>

        <Divider />

        {/* ===== MENU ===== */}
        <List>
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <ListItemButton
                key={item.path}
                component={Link}
                to={item.path}
                sx={{
                  pl: 2.5,
                  pr: 2,
                  py: 1.25,
                  mb: 0.5,
                  backgroundColor: active ? "#deeddf" : "transparent",
                  borderLeft: active ? "5px solid #1a7e16" : "5px solid transparent",
                  "&:hover": { backgroundColor: active ? "#e7f6e8" : "#f2f4f7" },
                  color: "rgba(0,0,0,0.87)",
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            );
          })}
        </List>
      </Drawer>

      {/* ===== MAIN CONTENT ===== */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "#fafafa",
          p: 4,
          mt: `${headerHeight}px`,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
