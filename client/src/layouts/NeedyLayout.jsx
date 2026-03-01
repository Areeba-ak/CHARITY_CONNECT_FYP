import React, { useEffect, useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
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
  LibraryBooks as StoryIcon,
  AddCircle as AddIcon,
  Edit as EditIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";

import { getMe } from "../services/auth";

const drawerWidth = 290;
const headerHeight = 100;

const menuItems = [
  { label: "Dashboard", path: "/NeedyDashboard", icon: <DashboardIcon /> },
  { label: "My Stories", path: "/needy/mystories", icon: <StoryIcon /> },
  { label: "Submit New Story", path: "/needy/submit", icon: <AddIcon /> },
  { label: "Edit Profile", path: "/needy/edit-profile", icon: <EditIcon /> },
  { label: "Settings", path: "/needy/settings", icon: <SettingsIcon /> },
  { label: "Logout", path: "/needy/logout", icon: <LogoutIcon /> },
];

export default function NeedyLayout() {
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const me = await getMe();
        setUser(me);
      } catch (err) {
        console.error("Failed to load needy user", err);
      }
    })();
  }, []);

  const isActive = (path) => {
    if ((location.pathname === "/needy" || location.pathname === "/needy/") && path === "/NeedyDashboard") {
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
          <Typography variant="caption" sx={{ color: "gray" }}>( NEEDY )</Typography>
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
