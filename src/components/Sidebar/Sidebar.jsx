import { useState, useEffect } from 'react';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Collapse,
  Divider,
  Typography,
  Avatar,
  Tooltip,
  Button,
  styled,
  useMediaQuery,
  useTheme
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 280;

// Styled components
const StyledListItemButton = styled(ListItemButton)(({ theme, active }) => ({
  borderRadius: '8px',
  margin: '4px 8px',
  color: active ? theme.palette.primary.main : theme.palette.text.secondary,
  backgroundColor: active ? theme.palette.primary.lighter : 'transparent',
  '&:hover': {
    backgroundColor: active ? theme.palette.primary.lighter : theme.palette.action.hover,
  },
  '& .MuiListItemIcon-root': {
    color: active ? theme.palette.primary.main : theme.palette.text.secondary,
  },
  '& .MuiListItemText-primary': {
    fontWeight: active ? 500 : 400,
  },
  transition: 'all 0.2s ease-in-out',
}));

const StyledSubListItemButton = styled(ListItemButton)(({ theme, active }) => ({
  borderRadius: '8px',
  marginLeft: '12px',
  marginRight: '8px',
  paddingLeft: '32px',
  color: active ? theme.palette.primary.main : theme.palette.text.secondary,
  backgroundColor: active ? theme.palette.primary.lighter : 'transparent',
  '&:hover': {
    backgroundColor: active ? theme.palette.primary.lighter : theme.palette.action.hover,
  },
  '& .MuiListItemIcon-root': {
    color: active ? theme.palette.primary.main : theme.palette.text.secondary,
    minWidth: '32px',
  },
  '& .MuiListItemText-primary': {
    fontWeight: active ? 500 : 400,
    fontSize: '0.9rem',
  },
  transition: 'all 0.2s ease-in-out',
}));

const Sidebar = ({ open = true, onClose, variant = "persistent" }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const [scholarshipOpen, setScholarshipOpen] = useState(
    location.pathname.includes('/scholarships')
  );

  // Effect để khi thay đổi đường dẫn trên mobile thì đóng drawer
  useEffect(() => {
    if (isMobile && onClose) {
      onClose();
    }
  }, [location.pathname, isMobile, onClose]);

  const handleScholarshipClick = () => {
    setScholarshipOpen(!scholarshipOpen);
  };

  const handleNavigation = (path) => {
    // Đơn giản hóa việc điều hướng - không cần e.preventDefault() vì
    // đã xử lý trong onClick của ListItemButton
    console.log('Đang chuyển đến:', path);
    
    // Điều hướng trực tiếp
    navigate(path);
    
    // Đóng drawer nếu đang ở mobile
    if (isMobile && onClose) {
      onClose(); // Gọi onClose ngay lập tức thay vì setTimeout
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isScholarshipActive = () => {
    return location.pathname.includes('/scholarships');
  };

  const menuItems = [
    { text: 'Trang chủ', icon: <HomeIcon />, path: '/' },
    { text: 'Quản lý người dùng', icon: <PeopleIcon />, path: '/users' },
  ];

  const scholarshipSubItems = [
    { text: 'Quản lý mẫu hồ sơ', icon: <AssignmentTurnedInIcon />, path: '/scholarships' },
    { text: 'Duyệt hồ sơ', icon: <AssignmentTurnedInIcon />, path: '/scholarships/review' },
  ];

  const sidebarContent = (
    <>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Avatar 
          src="/logo.png" 
          alt="Logo"
          sx={{ 
            width: 45, 
            height: 45, 
            bgcolor: 'primary.main',
            mr: 1.5,
            '& .MuiSvgIcon-root': {
              fontSize: '2rem'
            }
          }}
        >
          <SchoolIcon fontSize="large" />
        </Avatar>
        <Typography variant="h6" className="sidebar-title" fontWeight={700} color="primary">
          QUẢN LÝ HỌC BỔNG
        </Typography>
      </Box>
      <Divider sx={{ mx: 2, mb: 2 }} />
      
      <List sx={{ p: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <StyledListItemButton
              onClick={(e) => {
                e.preventDefault();
                handleNavigation(item.path);
              }}
              active={isActive(item.path) ? 1 : 0}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </StyledListItemButton>
          </ListItem>
        ))}

        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <StyledListItemButton
            onClick={handleScholarshipClick}
            active={isScholarshipActive() ? 1 : 0}
          >
            <ListItemIcon><SchoolIcon /></ListItemIcon>
            <ListItemText primary="Quản lý học bổng" />
            {scholarshipOpen ? <ExpandLess /> : <ExpandMore />}
          </StyledListItemButton>
        </ListItem>

        <Collapse in={scholarshipOpen || isScholarshipActive()} timeout="auto" unmountOnExit>
          <List component="div" disablePadding className="sidebar-submenu" sx={{ mt: 0.5 }}>
            {scholarshipSubItems.map((item) => (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <StyledSubListItemButton
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation(item.path);
                  }}
                  active={isActive(item.path) ? 1 : 0}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </StyledSubListItemButton>
              </ListItem>
            ))}
          </List>
        </Collapse>
      </List>
      
      <Box sx={{ flexGrow: 1 }} />
      
      <Box sx={{ p: 2, mx: 2, mb: 2, borderRadius: 2, bgcolor: 'primary.lighter' }}>
        <Typography variant="subtitle2" fontWeight={600} color="primary.main" gutterBottom>
          Cần hỗ trợ?
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Liên hệ với chúng tôi nếu bạn cần hỗ trợ về hệ thống
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<HelpOutlineIcon />}
          fullWidth
          size="small"
        >
          Trung tâm hỗ trợ
        </Button>
      </Box>
      
      <Box sx={{ p: 2, borderTop: '1px solid rgba(0, 0, 0, 0.06)' }}>
        <Typography 
          variant="caption" 
          color="text.secondary" 
          sx={{ display: 'block', textAlign: 'center', opacity: 0.7 }}
        >
          © 2025 Hệ thống Quản lý Học bổng
        </Typography>
      </Box>
    </>
  );

  // Nếu đang ở chế độ mobile và là drawer tạm thời
  if (variant === "temporary") {
    return (
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        {sidebarContent}
      </Box>
    );
  }

  // Nếu đang ở chế độ desktop và là drawer cố định
  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      className="sidebar-drawer"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          boxShadow: '1px 0px 10px rgba(0,0,0,0.05)',
          borderRight: '1px solid rgba(0, 0, 0, 0.06)',
        },
      }}
    >
      {sidebarContent}
    </Drawer>
  );
};

export default Sidebar; 