import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { 
  ThemeProvider, 
  createTheme, 
  CssBaseline, 
  Box, 
  Toolbar, 
  IconButton, 
  AppBar, 
  Badge, 
  Avatar, 
  Menu, 
  MenuItem, 
  Typography,
  Divider, 
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Breadcrumbs,
  Link,
  Drawer,
  useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Sidebar from './components/Sidebar/Sidebar';
import HomePage from './components/pages/HomePage';
import FormBuilder from './components/FormBuilder/FormBuilder';
import FormTemplateList from './components/FormTemplate/FormTemplateList';
import FormTemplateCreate from './components/FormTemplate/FormTemplateCreate';
import FormTemplateEdit from './components/FormTemplate/FormTemplateEdit';
import FormReview from './components/FormReview/FormReview';
import { FormProvider } from './contexts/FormContext';

// Khai báo độ rộng của drawer
const drawerWidth = 280;

// Tạo theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb',
      light: '#3b82f6',
      dark: '#1d4ed8',
      lighter: '#eff6ff',
    },
    secondary: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
      lighter: '#ecfdf5',
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      lighter: '#ecfdf5',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      lighter: '#fffbeb',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      lighter: '#fee2e2',
    },
    info: {
      main: '#3b82f6',
      light: '#60a5fa',
      lighter: '#eff6ff',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    divider: 'rgba(0, 0, 0, 0.06)',
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 8
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        },
      },
    },
  },
});

// Breadcrumb component
const CustomBreadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const getPageTitle = (path) => {
    switch(path) {
      case 'users': return 'Quản lý người dùng';
      case 'scholarships': return 'Học bổng';
      case 'create': return 'Tạo hồ sơ';
      case 'review': return 'Duyệt hồ sơ';
      default: return path.charAt(0).toUpperCase() + path.slice(1);
    }
  };

    return (
    <Breadcrumbs 
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
      sx={{ mt: 1, mb: 3 }}
    >
      <Link 
        color="inherit" 
        href="/"
                      sx={{
                    display: 'flex',
                    alignItems: 'center',
          textDecoration: 'none',
          '&:hover': { textDecoration: 'underline' }
        }}
      >
        <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
        Trang chủ
      </Link>
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;

        return last ? (
          <Typography key={to} color="text.primary" fontWeight={500}>
            {getPageTitle(value)}
              </Typography>
        ) : (
          <Link
            key={to}
            color="inherit"
            href={to}
                    sx={{ 
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            {getPageTitle(value)}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

function App() {
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(!isSmallScreen);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationEl, setNotificationEl] = useState(null);
  const location = useLocation();

  // Toggle drawer for desktop
  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  // Toggle drawer for mobile
  const handleMobileDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationOpen = (event) => {
    setNotificationEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationEl(null);
  };

  // Mock data for notifications
  const notifications = [
    { id: 1, content: 'Hồ sơ của bạn đã được duyệt', time: '10 phút trước' },
    { id: 2, content: 'Học bổng mới đã được thêm vào', time: '2 giờ trước' },
    { id: 3, content: 'Hạn nộp hồ sơ đã được cập nhật', time: '1 ngày trước' },
  ];

  return (
    <ThemeProvider theme={theme}>
        <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <AppBar 
          position="fixed" 
          sx={{ 
            width: { sm: '100%', md: `calc(100% - ${open ? 280 : 0}px)` },
            ml: { md: `${open ? 280 : 0}px` },
            bgcolor: 'background.paper',
            color: 'text.primary',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            zIndex: (theme) => theme.zIndex.drawer + 1,
            transition: theme => theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          }}
        >
          <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
              onClick={isSmallScreen ? handleMobileDrawerToggle : handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            
            <Box sx={{ flexGrow: 1 }} />

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {/* Search Button */}
              <Tooltip title="Tìm kiếm">
                <IconButton 
                  size="large" 
                  color="inherit"
                  sx={{ mr: 1, display: { xs: 'none', sm: 'flex' } }}
                >
                  <SearchIcon />
                </IconButton>
              </Tooltip>

              {/* Notification Button */}
              <Tooltip title="Thông báo">
                <IconButton 
                  size="large" 
                  color="inherit"
                  onClick={handleNotificationOpen}
                  sx={{ mr: 1 }}
                >
                  <Badge badgeContent={notifications.length} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>

              {/* Notification Menu */}
              <Menu
                anchorEl={notificationEl}
                id="notification-menu"
                open={Boolean(notificationEl)}
                onClose={handleNotificationClose}
                PaperProps={{
                  elevation: 0,
                  sx: { 
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                    width: 320, 
                    mt: 1.5,
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <Box sx={{ p: 2, pb: 1 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Thông báo
                  </Typography>
                </Box>
                <Divider />
                <List sx={{ py: 0 }}>
                  {notifications.map((notification) => (
                    <ListItem 
                      key={notification.id} 
                        sx={{
                        px: 2, 
                        py: 1,
                        '&:hover': {
                          bgcolor: 'background.default'
                        }
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography variant="body2" fontWeight={500}>
                            {notification.content}
                      </Typography>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            {notification.time}
                      </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
                <Divider />
                <Box sx={{ p: 1, display: 'flex', justifyContent: 'center' }}>
                      <Typography 
                        variant="body2" 
                    color="primary" 
                        sx={{
                      cursor: 'pointer',
                      fontWeight: 500,
                      py: 1
                    }}
                  >
                    Xem tất cả thông báo
                      </Typography>
                </Box>
              </Menu>

              {/* Settings Button */}
              <Tooltip title="Cài đặt">
                <IconButton
                  size="large"
                  color="inherit"
                  sx={{ mr: 1, display: { xs: 'none', sm: 'flex' } }}
                >
                  <SettingsIcon />
                </IconButton>
              </Tooltip>

              {/* User Profile Button */}
              <Tooltip title="Tài khoản">
                <IconButton
                  size="large"
                  edge="end"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
              <Avatar 
                    alt="User Profile" 
                sx={{ 
                      width: 35, 
                      height: 35, 
                      bgcolor: 'primary.main' 
                    }}
                  >
                    NT
              </Avatar>
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Profile Menu */}
              <Menu
                anchorEl={anchorEl}
          id="account-menu"
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
                PaperProps={{
            elevation: 0,
                  sx: { 
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
              width: 200,
                    mt: 1.5,
            },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
          <MenuItem sx={{ p: 2, pt: 1.5, pb: 1.5 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="subtitle1" fontWeight={600}>
                Nguyễn Trung
              </Typography>
              <Typography variant="body2" color="text.secondary">
                admin@example.com
              </Typography>
                </Box>
          </MenuItem>
                <Divider />
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            Tài khoản của tôi
                </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            Cài đặt
                </MenuItem>
                <Divider />
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Đăng xuất
                </MenuItem>
              </Menu>
        
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleMobileDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better mobile performance
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              width: drawerWidth,
              boxShadow: '1px 0px 10px rgba(0,0,0,0.05)',
            },
          }}
        >
          <Sidebar onClose={handleMobileDrawerToggle} />
        </Drawer>
        
        {/* Desktop Drawer */}
        {!isSmallScreen && (
          <Sidebar open={open} onClose={handleDrawerToggle} />
        )}
        
        <Box
          component="main"
          sx={{ 
            flexGrow: 1,
            p: { xs: 2, sm: 3 },
            width: { xs: '100%', md: `calc(100% - ${open ? 280 : 0}px)` },
            ml: { md: `${open ? 280 : 0}px` },
            transition: theme => theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          }}
        >
          <Toolbar />
          
          {/* Breadcrumbs - only show when not on homepage */}
          {location.pathname !== "/" && <CustomBreadcrumbs />}
          
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/users" element={<div>Quản lý người dùng</div>} />
            <Route path="/scholarships">
              <Route index element={<FormProvider><FormTemplateCreate /></FormProvider>} />
              <Route path="edit/:id" element={<FormProvider><FormTemplateEdit /></FormProvider>} />
              <Route path="builder" element={<FormProvider><FormBuilder /></FormProvider>} />
              <Route path="review" element={<FormReview />} />
            </Route>
          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
