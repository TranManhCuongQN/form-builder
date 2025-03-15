import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Toolbar,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  RateReview as ReviewIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

const Sidebar = ({ 
  mobileOpen, 
  handleDrawerToggle, 
  currentPage, 
  handlePageChange 
}) => {
  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton 
            selected={currentPage === 'dashboard'} 
            onClick={() => handlePageChange('dashboard')}
          >
            <ListItemIcon>
              <DashboardIcon color={currentPage === 'dashboard' ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Trang chủ" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton 
            selected={currentPage === 'users'} 
            onClick={() => handlePageChange('users')}
          >
            <ListItemIcon>
              <PeopleIcon color={currentPage === 'users' ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Người dùng" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton 
            selected={currentPage === 'scholarships'} 
            onClick={() => handlePageChange('scholarships')}
          >
            <ListItemIcon>
              <SchoolIcon color={currentPage === 'scholarships' ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Học bổng" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton 
            selected={currentPage === 'reviews'} 
            onClick={() => handlePageChange('reviews')}
          >
            <ListItemIcon>
              <ReviewIcon color={currentPage === 'reviews' ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Xét duyệt" />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton 
            selected={currentPage === 'profile'} 
            onClick={() => handlePageChange('profile')}
          >
            <ListItemIcon>
              <PersonIcon color={currentPage === 'profile' ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Hồ sơ" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar; 