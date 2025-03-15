import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Block as BlockIcon,
  CheckCircle as ActivateIcon,
} from '@mui/icons-material';

const UserTable = ({ 
  users, 
  getStatusColor, 
  getStatusLabel, 
  getInitials,
  handleOpenUserDialog,
  handleActionsClick,
  actionsEl,
  handleActionsClose,
  selectedUser
}) => {
  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', py: 1.5, px: 3, bgcolor: 'background.default' }}>
        <Grid container alignItems="center">
          <Grid item xs={5} md={3.5}>
            <Typography variant="subtitle2" fontWeight={600} color="text.secondary">Người dùng</Typography>
          </Grid>
          <Grid item xs={3} md={2.5} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Typography variant="subtitle2" fontWeight={600} color="text.secondary">Liên hệ</Typography>
          </Grid>
          <Grid item xs={3} md={2} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Typography variant="subtitle2" fontWeight={600} color="text.secondary">Vai trò</Typography>
          </Grid>
          <Grid item xs={3} md={2}>
            <Typography variant="subtitle2" fontWeight={600} color="text.secondary">Trạng thái</Typography>
          </Grid>
          <Grid item xs={4} md={2} sx={{ display: { xs: 'none', md: 'block' }, textAlign: 'center' }}>
            <Typography variant="subtitle2" fontWeight={600} color="text.secondary">Thao tác</Typography>
          </Grid>
        </Grid>
      </Box>
      
      {users.length > 0 ? (
        <Box>
          {users.map((user) => (
            <Box 
              key={user.id} 
              sx={{
                py: 2,
                px: 3,
                borderBottom: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.02)'
                }
              }}
            >
              <Grid container alignItems="center">
                <Grid item xs={5} md={3.5}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: 'primary.light', width: 40, height: 40, mr: 2 }}>
                      {getInitials(user.name)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>{user.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{user.username}</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={3} md={2.5} sx={{ display: { xs: 'none', md: 'block' } }}>
                  <Typography variant="body2">{user.email}</Typography>
                  <Typography variant="body2" color="text.secondary">{user.phone}</Typography>
                </Grid>
                <Grid item xs={3} md={2} sx={{ display: { xs: 'none', md: 'block' } }}>
                  <Chip 
                    label={user.role === 'admin' ? 'Quản trị viên' : user.role === 'reviewer' ? 'Người duyệt' : 'Người dùng'} 
                    size="small" 
                    color={user.role === 'admin' ? 'primary' : user.role === 'reviewer' ? 'info' : 'default'}
                    variant={user.role === 'user' ? 'outlined' : 'filled'}
                  />
                </Grid>
                <Grid item xs={3} md={2}>
                  <Chip 
                    label={getStatusLabel(user.status)} 
                    size="small" 
                    color={getStatusColor(user.status)}
                  />
                </Grid>
                <Grid item xs={4} md={2} sx={{ textAlign: 'center' }}>
                  <IconButton
                    size="small"
                    onClick={(e) => handleActionsClick(e, user)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Box>
          ))}
        </Box>
      ) : (
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">Không tìm thấy người dùng nào</Typography>
        </Box>
      )}
      
      <Menu
        anchorEl={actionsEl}
        open={Boolean(actionsEl)}
        onClose={handleActionsClose}
        elevation={0}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => {
          handleActionsClose();
          if (selectedUser) handleOpenUserDialog(selectedUser);
        }}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Chỉnh sửa</ListItemText>
        </MenuItem>
        {selectedUser && selectedUser.status === 'active' ? (
          <MenuItem onClick={handleActionsClose}>
            <ListItemIcon>
              <BlockIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Vô hiệu hóa</ListItemText>
          </MenuItem>
        ) : (
          <MenuItem onClick={handleActionsClose}>
            <ListItemIcon>
              <ActivateIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Kích hoạt</ListItemText>
          </MenuItem>
        )}
        <Divider />
        <MenuItem onClick={handleActionsClose}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText sx={{ color: 'error.main' }}>Xóa</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserTable; 