import React, { useEffect, useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
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
  Feed as FeedIcon,
  Group as GroupIcon,
  Payment as PaymentIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";

import { getMe } from "../services/auth";

const drawerWidth = 290;
const headerHeight = 100;

const menuItems = [
  { label: "Dashboard", path: "/AdminDashboard", icon: <DashboardIcon /> },
  { label: "Story Management", path: "/admin/story-management", icon: <FeedIcon /> },
  { label: "User Management", path: "/admin/user-management", icon: <GroupIcon /> },
  { label: "Payment & Donation", path: "/admin/payment-donation", icon: <PaymentIcon /> },
  { label: "Reports & Feedbacks", path: "/admin/reports-feedbacks", icon: <AssessmentIcon /> },
  { label: "Settings", path: "/admin/settings", icon: <SettingsIcon /> },
  { label: "Logout", path: "/admin/logout", icon: <LogoutIcon /> },
];

export default function AdminLayout() {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const me = await getMe();
        setAdmin(me);
      } catch (err) {
        console.error("Failed to load admin", err);
      }
    })();
  }, []);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
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
        {/* ===== ADMIN PROFILE ===== */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar
            src={admin?.avatar || "/assets/admin-avatar.png"}
            sx={{ width: 70, height: 70, bgcolor: "#e0e0e0" }}
          />

          <Typography sx={{ mt: 1, fontWeight: 700 }}>
            {admin ? `${admin.firstName} ${admin.lastName}` : "Loading..."}
          </Typography>

          <Typography variant="caption" sx={{ color: "gray" }}>
            ( ADMIN )
          </Typography>
        </Box>

        <Divider />

        {/* ===== MENU ===== */}
        <List>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.path}
              component={NavLink}
              to={item.path}
              end={item.path === "/AdminDashboard"}
              sx={{
                pl: 2.5,
                pr: 2,
                py: 1.25,
                mb: 0.5,
                "&.active": {
                  backgroundColor: "#deeddf",
                  borderLeft: "5px solid #1a7e16",
                  fontWeight: "bold",
                },
                "&:hover": { backgroundColor: "#f2f4f7" },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      {/* ===== CONTENT ===== */}
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
