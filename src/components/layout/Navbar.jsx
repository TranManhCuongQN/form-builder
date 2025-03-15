import React from 'react';
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  Avatar,
  Badge,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';

const Navbar = ({ 
  handleDrawerToggle, 
  handleProfileClick, 
  profileEl, 
  handleProfileClose, 
  handleNotificationClick, 
  notificationEl, 
  handleNotificationClose,
  handleUserMenuClick,
  userMenuEl,
  handleUserMenuClose,
  isAuthenticated
}) => {
  return (
    <AppBar 
      position="fixed" 
      color="inherit" 
      elevation={0}
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Form Builder
        </Typography>
        
        {isAuthenticated && (
          <Box sx={{ display: 'flex' }}>
            <IconButton 
              color="inherit"
              onClick={handleNotificationClick}
            >
              <Badge badgeContent={4} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Menu
              anchorEl={notificationEl}
              open={Boolean(notificationEl)}
              onClose={handleNotificationClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                  mt: 1.5,
                  width: 350,
                  borderRadius: 2,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem>
                <Box sx={{ width: '100%' }}>
                  <Typography variant="subtitle1" fontWeight={600}>Thông báo</Typography>
                  <Typography variant="body2" color="text.secondary">Bạn có 4 thông báo mới</Typography>
                </Box>
              </MenuItem>
              <Divider />
              <MenuItem>
                <Box sx={{ width: '100%' }}>
                  <Typography variant="subtitle2">Hồ sơ của bạn đã được chấp nhận</Typography>
                  <Typography variant="caption" color="text.secondary">2 giờ trước</Typography>
                </Box>
              </MenuItem>
              <MenuItem>
                <Box sx={{ width: '100%' }}>
                  <Typography variant="subtitle2">Người dùng mới đã đăng ký</Typography>
                  <Typography variant="caption" color="text.secondary">8 giờ trước</Typography>
                </Box>
              </MenuItem>
              <Divider />
              <MenuItem sx={{ justifyContent: 'center' }}>
                <Typography variant="body2" color="primary">Xem tất cả thông báo</Typography>
              </MenuItem>
            </Menu>
            
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              onClick={handleProfileClick}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>NT</Avatar>
            </IconButton>
            <Menu
              anchorEl={profileEl}
              open={Boolean(profileEl)}
              onClose={handleProfileClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                  mt: 1.5,
                  width: 200,
                  borderRadius: 2,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleProfileClose}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Hồ sơ</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleProfileClose}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Cài đặt</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleProfileClose}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Đăng xuất</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 