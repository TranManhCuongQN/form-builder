import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  TextField,
  InputAdornment,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import UserTable from '../user/UserTable';
import UserDialog from '../user/UserDialog';
import { getStatusColor, getStatusLabel, getInitials } from '../../utils/helpers';

const UsersPage = () => {
  // State cho tìm kiếm và lọc
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // State cho dialog
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // State cho menu actions
  const [actionsEl, setActionsEl] = useState(null);
  const [selectedActionUser, setSelectedActionUser] = useState(null);
  
  // Mẫu dữ liệu người dùng
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Nguyễn Thành An',
      username: 'anthanh',
      email: 'an.nguyen@example.com',
      phone: '0912345678',
      role: 'admin',
      status: 'active',
    },
    {
      id: 2,
      name: 'Trần Thị Bình',
      username: 'binhtran',
      email: 'binh.tran@example.com',
      phone: '0923456789',
      role: 'reviewer',
      status: 'active',
    },
    {
      id: 3,
      name: 'Phạm Văn Cường',
      username: 'cuongpham',
      email: 'cuong.pham@example.com',
      phone: '0934567890',
      role: 'user',
      status: 'inactive',
    },
    {
      id: 4,
      name: 'Lê Thị Dung',
      username: 'dung.le',
      email: 'dung.le@example.com',
      phone: '0945678901',
      role: 'user',
      status: 'banned',
    },
    {
      id: 5,
      name: 'Hoàng Văn Em',
      username: 'emhoang',
      email: 'em.hoang@example.com',
      phone: '0956789012',
      role: 'reviewer',
      status: 'active',
    },
  ]);
  
  // Hàm xử lý khi thay đổi ô tìm kiếm
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  
  // Hàm xử lý khi thay đổi lọc vai trò
  const handleRoleChange = (event) => {
    setRoleFilter(event.target.value);
  };
  
  // Hàm xử lý khi thay đổi lọc trạng thái
  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
  };
  
  // Hàm mở dialog để thêm/sửa người dùng
  const handleOpenUserDialog = (user = null) => {
    setSelectedUser(user);
    setOpenUserDialog(true);
    // Đóng menu actions nếu đang mở
    setActionsEl(null);
  };
  
  // Hàm đóng dialog
  const handleCloseUserDialog = () => {
    setOpenUserDialog(false);
    setSelectedUser(null);
  };
  
  // Hàm xử lý khi lưu người dùng
  const handleSaveUser = (userData) => {
    if (selectedUser) {
      // Cập nhật người dùng hiện có
      setUsers(users.map(user => 
        user.id === userData.id ? userData : user
      ));
    } else {
      // Thêm người dùng mới
      setUsers([...users, userData]);
    }
  };
  
  // Hàm xử lý mở menu actions
  const handleActionsClick = (event, user) => {
    setActionsEl(event.currentTarget);
    setSelectedActionUser(user);
  };
  
  // Hàm đóng menu actions
  const handleActionsClose = () => {
    setActionsEl(null);
    setSelectedActionUser(null);
  };
  
  // Lọc người dùng dựa trên tìm kiếm và bộ lọc
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });
  
  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" fontWeight={600} sx={{ mb: 1 }}>
          Quản lý người dùng
        </Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            disableElevation
            onClick={() => handleOpenUserDialog()}
          >
            Thêm người dùng
          </Button>
        </Box>
      </Box>
      
      {/* Bộ lọc */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            placeholder="Tìm kiếm người dùng..."
            fullWidth
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={6} sm={3} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Vai trò</InputLabel>
            <Select
              value={roleFilter}
              label="Vai trò"
              onChange={handleRoleChange}
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="admin">Quản trị viên</MenuItem>
              <MenuItem value="reviewer">Người duyệt</MenuItem>
              <MenuItem value="user">Người dùng</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} sm={3} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={statusFilter}
              label="Trạng thái"
              onChange={handleStatusChange}
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="active">Hoạt động</MenuItem>
              <MenuItem value="inactive">Không hoạt động</MenuItem>
              <MenuItem value="banned">Đã khóa</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      
      {/* Bảng người dùng */}
      <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <UserTable 
          users={filteredUsers}
          getStatusColor={getStatusColor}
          getStatusLabel={getStatusLabel}
          getInitials={getInitials}
          handleOpenUserDialog={handleOpenUserDialog}
          handleActionsClick={handleActionsClick}
          actionsEl={actionsEl}
          handleActionsClose={handleActionsClose}
          selectedUser={selectedActionUser}
        />
      </Card>
      
      {/* Dialog thêm/sửa người dùng */}
      <UserDialog 
        open={openUserDialog}
        user={selectedUser}
        handleClose={handleCloseUserDialog}
        onSave={handleSaveUser}
      />
    </Box>
  );
};

export default UsersPage; 