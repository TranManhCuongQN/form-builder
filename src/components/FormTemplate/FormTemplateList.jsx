import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  TextField,
  InputAdornment,
  Paper
} from '@mui/material';
import { 
  Add as AddIcon, 
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as DuplicateIcon,
  Search as SearchIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Dữ liệu mẫu cho các mẫu hồ sơ
const dummyTemplates = [
  { 
    id: 1, 
    name: 'Mẫu đơn học bổng sinh viên xuất sắc', 
    type: 'Học bổng tài năng', 
    steps: 3, 
    updatedAt: '2023-10-15', 
    status: 'active'
  },
  { 
    id: 2, 
    name: 'Mẫu đơn xin hỗ trợ tài chính', 
    type: 'Học bổng khó khăn', 
    steps: 2, 
    updatedAt: '2023-10-12', 
    status: 'active'
  },
  { 
    id: 3, 
    name: 'Đơn đăng ký học bổng nước ngoài', 
    type: 'Học bổng quốc tế', 
    steps: 4, 
    updatedAt: '2023-10-10', 
    status: 'draft'
  },
  { 
    id: 4, 
    name: 'Đơn xin học bổng nghiên cứu', 
    type: 'Học bổng nghiên cứu', 
    steps: 3, 
    updatedAt: '2023-10-05', 
    status: 'active'
  },
  { 
    id: 5, 
    name: 'Mẫu đơn học bổng toàn phần', 
    type: 'Học bổng toàn phần', 
    steps: 5, 
    updatedAt: '2023-10-02', 
    status: 'inactive'
  },
];

const FormTemplateList = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState(dummyTemplates);
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  
  // Xử lý khi nhấn nút thêm mới
  const handleAddNew = () => {
    navigate('/scholarships/create');
  };
  
  // Xử lý khi mở menu actions
  const handleOpenMenu = (event, template) => {
    setAnchorEl(event.currentTarget);
    setSelectedTemplate(template);
  };
  
  // Xử lý khi đóng menu actions
  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedTemplate(null);
  };
  
  // Xử lý khi nhấn nút chỉnh sửa
  const handleEdit = () => {
    if (selectedTemplate) {
      navigate(`/scholarships/edit/${selectedTemplate.id}`);
    }
    handleCloseMenu();
  };
  
  // Xử lý khi nhấn nút xóa
  const handleDelete = () => {
    if (selectedTemplate) {
      setTemplates(templates.filter(template => template.id !== selectedTemplate.id));
    }
    handleCloseMenu();
  };
  
  // Xử lý khi nhấn nút nhân bản
  const handleDuplicate = () => {
    if (selectedTemplate) {
      const newTemplate = {
        ...selectedTemplate,
        id: Math.max(...templates.map(t => t.id)) + 1,
        name: `${selectedTemplate.name} (Bản sao)`,
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setTemplates([...templates, newTemplate]);
    }
    handleCloseMenu();
  };
  
  // Lọc mẫu đơn theo từ khóa tìm kiếm
  const filteredTemplates = templates.filter(template => 
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.type.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Lấy màu cho trạng thái
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return { bg: 'success.main', text: 'white' };
      case 'draft': return { bg: 'warning.main', text: 'white' };
      case 'inactive': return { bg: 'error.main', text: 'white' };
      default: return { bg: 'grey.500', text: 'white' };
    }
  };
  
  // Lấy tên hiển thị cho trạng thái
  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return 'Đang hoạt động';
      case 'draft': return 'Bản nháp';
      case 'inactive': return 'Không hoạt động';
      default: return 'Không xác định';
    }
  };

  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3 
      }}>
        <Typography variant="h4" fontWeight="600">
          Quản lý mẫu hồ sơ
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleAddNew}
          sx={{ borderRadius: 2 }}
        >
          Tạo mẫu mới
        </Button>
      </Box>
      
      <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <TextField
          fullWidth
          placeholder="Tìm kiếm mẫu hồ sơ..."
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ bgcolor: 'background.paper' }}
        />
      </Paper>
      
      <Grid container spacing={3}>
        {filteredTemplates.map((template) => (
          <Grid item xs={12} sm={6} md={4} key={template.id}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              borderRadius: 2,
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
              }
            }}>
              <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Chip 
                    label={getStatusLabel(template.status)} 
                    size="small"
                    sx={{ 
                      bgcolor: getStatusColor(template.status).bg, 
                      color: getStatusColor(template.status).text,
                      fontWeight: 500
                    }}
                  />
                  <IconButton 
                    size="small" 
                    onClick={(e) => handleOpenMenu(e, template)}
                    aria-label="more"
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </Box>
                
                <Typography variant="h6" component="h2" fontWeight="600" sx={{ mb: 1 }}>
                  {template.name}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Loại: {template.type}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AssignmentIcon fontSize="small" sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography variant="body2">
                    {template.steps} bước
                  </Typography>
                </Box>
                
                <Typography variant="caption" color="text.secondary">
                  Cập nhật: {template.updatedAt}
                </Typography>
              </CardContent>
              <Divider />
              <CardActions>
                <Button 
                  size="small" 
                  sx={{ textTransform: 'none' }}
                  onClick={() => navigate(`/scholarships/edit/${template.id}`)}
                >
                  Chỉnh sửa
                </Button>
                <Button 
                  size="small" 
                  sx={{ textTransform: 'none' }}
                  onClick={() => console.log('Preview template', template.id)}
                >
                  Xem trước
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
        
        {filteredTemplates.length === 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Không tìm thấy mẫu hồ sơ nào
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Thử thay đổi từ khóa tìm kiếm hoặc tạo mẫu mới
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
      
      {/* Menu hành động trên mỗi mẫu hồ sơ */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 2,
          sx: { minWidth: 180, borderRadius: 2 }
        }}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Chỉnh sửa
        </MenuItem>
        <MenuItem onClick={handleDuplicate}>
          <ListItemIcon>
            <DuplicateIcon fontSize="small" />
          </ListItemIcon>
          Nhân bản
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <ListItemIcon sx={{ color: 'error.main' }}>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          Xóa
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default FormTemplateList; 