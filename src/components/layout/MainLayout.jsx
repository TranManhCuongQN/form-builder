import React, { useState } from 'react';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const drawerWidth = 240;

const MainLayout = ({ children, currentPage, onPageChange }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileEl, setProfileEl] = useState(null);
  const [notificationEl, setNotificationEl] = useState(null);
  const [userMenuEl, setUserMenuEl] = useState(null);
  const isAuthenticated = true; // Giả sử người dùng đã đăng nhập

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileClick = (event) => {
    setProfileEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileEl(null);
  };

  const handleUserMenuClick = (event) => {
    setUserMenuEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuEl(null);
  };

  const handleNotificationClick = (event) => {
    setNotificationEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationEl(null);
  };

  const handlePageChange = (page) => {
    onPageChange(page);
    setMobileOpen(false); // Đóng sidebar trên mobile khi chuyển trang
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Navbar 
        handleDrawerToggle={handleDrawerToggle}
        handleProfileClick={handleProfileClick}
        profileEl={profileEl}
        handleProfileClose={handleProfileClose}
        handleNotificationClick={handleNotificationClick}
        notificationEl={notificationEl}
        handleNotificationClose={handleNotificationClose}
        handleUserMenuClick={handleUserMenuClick}
        userMenuEl={userMenuEl}
        handleUserMenuClose={handleUserMenuClose}
        isAuthenticated={isAuthenticated}
      />
      <Sidebar 
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
      />
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          marginLeft: { sm: `${drawerWidth}px` }
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout; 