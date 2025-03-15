import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Grid,
  Fade,
  Container
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';

// Mock data cho các hồ sơ đã nộp
const mockSubmissions = [
  { 
    id: 1, 
    formTitle: 'Học bổng Xuất sắc 2023', 
    applicantName: 'Nguyễn Văn A', 
    email: 'nguyenvana@example.com',
    phone: '0901234567',
    submittedDate: '2023-05-15T08:30:00',
    status: 'pending'
  },
  { 
    id: 2, 
    formTitle: 'Học bổng Xuất sắc 2023', 
    applicantName: 'Trần Thị B', 
    email: 'tranthib@example.com',
    phone: '0901234568',
    submittedDate: '2023-05-14T10:15:00',
    status: 'approved'
  },
  { 
    id: 3, 
    formTitle: 'Học bổng Tài năng 2023', 
    applicantName: 'Lê Văn C', 
    email: 'levanc@example.com',
    phone: '0901234569',
    submittedDate: '2023-05-16T14:45:00',
    status: 'rejected'
  },
  { 
    id: 4, 
    formTitle: 'Học bổng Nghiên cứu 2023', 
    applicantName: 'Phạm Thị D', 
    email: 'phamthid@example.com',
    phone: '0901234570',
    submittedDate: '2023-05-17T09:20:00',
    status: 'pending'
  },
  { 
    id: 5, 
    formTitle: 'Học bổng Toàn phần 2023', 
    applicantName: 'Hoàng Văn E', 
    email: 'hoangvane@example.com',
    phone: '0901234571',
    submittedDate: '2023-05-13T16:10:00',
    status: 'approved'
  },
  { 
    id: 6, 
    formTitle: 'Học bổng Toàn phần 2023', 
    applicantName: 'Vũ Thị F', 
    email: 'vuthif@example.com',
    phone: '0901234572',
    submittedDate: '2023-05-12T11:30:00',
    status: 'pending'
  },
  { 
    id: 7, 
    formTitle: 'Học bổng Tài năng 2023', 
    applicantName: 'Đặng Văn G', 
    email: 'dangvang@example.com',
    phone: '0901234573',
    submittedDate: '2023-05-11T13:45:00',
    status: 'rejected'
  },
];

// Mock data chi tiết cho một hồ sơ
const mockSubmissionDetail = {
  personalInfo: {
    fullName: 'Nguyễn Văn A',
    dateOfBirth: '01/01/2000',
    gender: 'Nam',
    email: 'nguyenvana@example.com',
    phone: '0901234567',
    address: '123 Đường ABC, Quận XYZ, TP HCM'
  },
  educationInfo: {
    university: 'Đại học ABC',
    major: 'Công nghệ thông tin',
    studentId: 'SV12345',
    currentYear: 'Năm 3',
    gpa: '3.8/4.0'
  },
  scholarship: {
    type: 'Học bổng Xuất sắc 2023',
    reason: 'Em mong muốn nhận được học bổng để tiếp tục phát triển kỹ năng chuyên môn và hỗ trợ tài chính cho việc học tập.',
    achievements: 'Giải nhất cuộc thi lập trình cấp trường, tham gia nghiên cứu khoa học sinh viên.',
    targetAmount: '10.000.000 VNĐ'
  },
  documents: [
    { name: 'CV.pdf', url: '#' },
    { name: 'BangDiem.pdf', url: '#' },
    { name: 'ChungNhanGiaiThuong.pdf', url: '#' }
  ]
};

const FormReview = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [anchorElFilter, setAnchorElFilter] = useState(null);
  const [anchorElAction, setAnchorElAction] = useState(null);
  const [currentActionId, setCurrentActionId] = useState(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [currentSubmission, setCurrentSubmission] = useState(null);
  const [submissions, setSubmissions] = useState(mockSubmissions);

  // Xử lý thay đổi trang
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Xử lý thay đổi số dòng mỗi trang
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Mở menu lọc
  const handleFilterClick = (event) => {
    setAnchorElFilter(event.currentTarget);
  };

  // Đóng menu lọc
  const handleFilterClose = () => {
    setAnchorElFilter(null);
  };

  // Áp dụng lọc trạng thái
  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    handleFilterClose();
  };

  // Xử lý tìm kiếm
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  // Mở menu hành động
  const handleActionClick = (event, id) => {
    setAnchorElAction(event.currentTarget);
    setCurrentActionId(id);
  };

  // Đóng menu hành động
  const handleActionClose = () => {
    setAnchorElAction(null);
    setCurrentActionId(null);
  };

  // Mở dialog xem chi tiết
  const handleViewDetail = (submission) => {
    setCurrentSubmission(submission);
    setOpenDetailDialog(true);
    handleActionClose();
  };

  // Đóng dialog xem chi tiết
  const handleCloseDetail = () => {
    setOpenDetailDialog(false);
    setCurrentSubmission(null);
  };

  // Xử lý duyệt hồ sơ
  const handleApprove = (id) => {
    setSubmissions(prev => 
      prev.map(sub => sub.id === id ? {...sub, status: 'approved'} : sub)
    );
    handleActionClose();
  };

  // Xử lý từ chối hồ sơ
  const handleReject = (id) => {
    setSubmissions(prev => 
      prev.map(sub => sub.id === id ? {...sub, status: 'rejected'} : sub)
    );
    handleActionClose();
  };

  // Lọc dữ liệu theo tìm kiếm và trạng thái
  const filteredData = submissions
    .filter(row => 
      row.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.formTitle.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(row => statusFilter === 'all' ? true : row.status === statusFilter);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`;
  };

  // Render trạng thái chip
  const renderStatusChip = (status) => {
    switch(status) {
      case 'pending':
        return <Chip label="Chưa duyệt" color="warning" size="small" />;
      case 'approved':
        return <Chip label="Đã duyệt" color="success" size="small" />;
      case 'rejected':
        return <Chip label="Từ chối" color="error" size="small" />;
      default:
        return <Chip label="Không xác định" size="small" />;
    }
  };

  return (
    <Fade in>
      <Container maxWidth="lg" sx={{ px: { xs: 0, sm: 2 } }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight="500" color="primary.main">
            Quản lý hồ sơ học bổng
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Duyệt và quản lý các hồ sơ học bổng đã được nộp
          </Typography>
        </Box>

        <Paper sx={{ width: '100%', borderRadius: 2, overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <TextField
              placeholder="Tìm kiếm theo tên, email hoặc mẫu đơn"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={handleSearch}
              sx={{ width: { xs: '100%', sm: 350 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="outlined"
              size="medium"
              startIcon={<FilterListIcon />}
              onClick={handleFilterClick}
              sx={{ borderRadius: 1, display: { xs: 'none', sm: 'flex' } }}
            >
              Lọc
            </Button>
            
            <IconButton 
              sx={{ display: { xs: 'block', sm: 'none' } }}
              onClick={handleFilterClick}
            >
              <FilterListIcon />
            </IconButton>
            
            <Menu
              anchorEl={anchorElFilter}
              open={Boolean(anchorElFilter)}
              onClose={handleFilterClose}
              PaperProps={{ sx: { minWidth: 180 } }}
            >
              <MenuItem 
                onClick={() => handleStatusFilter('all')}
                selected={statusFilter === 'all'}
              >
                Tất cả
              </MenuItem>
              <MenuItem 
                onClick={() => handleStatusFilter('pending')}
                selected={statusFilter === 'pending'}
              >
                Chưa duyệt
              </MenuItem>
              <MenuItem 
                onClick={() => handleStatusFilter('approved')}
                selected={statusFilter === 'approved'}
              >
                Đã duyệt
              </MenuItem>
              <MenuItem 
                onClick={() => handleStatusFilter('rejected')}
                selected={statusFilter === 'rejected'}
              >
                Từ chối
              </MenuItem>
            </Menu>
          </Box>

          <TableContainer>
            <Table sx={{ minWidth: 750 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'background.default' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Mẫu đơn</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Người nộp</TableCell>
                  <TableCell sx={{ fontWeight: 600, display: { xs: 'none', md: 'table-cell' } }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600, display: { xs: 'none', md: 'table-cell' } }}>Thời gian nộp</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow key={row.id} hover>
                      <TableCell sx={{ maxWidth: 200 }}>
                        <Typography noWrap variant="body2">{row.formTitle}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{row.applicantName}</Typography>
                      </TableCell>
                      <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                        <Typography variant="body2">{row.email}</Typography>
                      </TableCell>
                      <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                        <Typography variant="body2">{formatDate(row.submittedDate)}</Typography>
                      </TableCell>
                      <TableCell>
                        {renderStatusChip(row.status)}
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <IconButton
                            size="small"
                            onClick={(e) => handleActionClick(e, row.id)}
                          >
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                {filteredData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                      <Typography variant="body1">
                        Không tìm thấy hồ sơ nào
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            component="div"
            count={filteredData.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Số dòng mỗi trang:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} của ${count}`
            }
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Paper>

        {/* Action Menu */}
        <Menu
          anchorEl={anchorElAction}
          open={Boolean(anchorElAction)}
          onClose={handleActionClose}
          PaperProps={{ sx: { minWidth: 170 } }}
        >
          <MenuItem 
            onClick={() => handleViewDetail(submissions.find(s => s.id === currentActionId))}
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <VisibilityIcon fontSize="small" color="action" />
            <Typography variant="body2">Xem chi tiết</Typography>
          </MenuItem>
          <MenuItem 
            onClick={() => handleApprove(currentActionId)}
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            disabled={submissions.find(s => s.id === currentActionId)?.status === 'approved'}
          >
            <CheckCircleIcon fontSize="small" color="success" />
            <Typography variant="body2">Phê duyệt</Typography>
          </MenuItem>
          <MenuItem 
            onClick={() => handleReject(currentActionId)}
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            disabled={submissions.find(s => s.id === currentActionId)?.status === 'rejected'}
          >
            <CancelIcon fontSize="small" color="error" />
            <Typography variant="body2">Từ chối</Typography>
          </MenuItem>
        </Menu>

        {/* Detail Dialog */}
        <Dialog 
          open={openDetailDialog} 
          onClose={handleCloseDetail}
          maxWidth="md"
          fullWidth
          PaperProps={{ 
            sx: { 
              borderRadius: 2,
              maxHeight: '90vh'
            } 
          }}
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, py: 2 }}>
            <Typography variant="h6">Chi tiết hồ sơ</Typography>
            <IconButton onClick={handleCloseDetail} size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          </DialogTitle>
          <Divider />
          <DialogContent sx={{ px: 3, py: 2 }}>
            {currentSubmission && (
              <Box>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" color="primary" fontWeight={600} gutterBottom>
                    Thông tin đơn
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Loại học bổng
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          {currentSubmission.formTitle}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Ngày nộp
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          {formatDate(currentSubmission.submittedDate)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Trạng thái
                        </Typography>
                        <Box sx={{ mt: 0.5 }}>
                          {renderStatusChip(currentSubmission.status)}
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" color="primary" fontWeight={600} gutterBottom>
                    Thông tin cá nhân
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Họ và tên
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          {mockSubmissionDetail.personalInfo.fullName}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Ngày sinh
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          {mockSubmissionDetail.personalInfo.dateOfBirth}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Giới tính
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          {mockSubmissionDetail.personalInfo.gender}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Email
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          {currentSubmission.email}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Số điện thoại
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          {currentSubmission.phone}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Địa chỉ
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          {mockSubmissionDetail.personalInfo.address}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" color="primary" fontWeight={600} gutterBottom>
                    Thông tin học tập
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Trường đại học
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          {mockSubmissionDetail.educationInfo.university}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Ngành học
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          {mockSubmissionDetail.educationInfo.major}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Mã số sinh viên
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          {mockSubmissionDetail.educationInfo.studentId}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Năm học
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          {mockSubmissionDetail.educationInfo.currentYear}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Điểm trung bình
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          {mockSubmissionDetail.educationInfo.gpa}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" color="primary" fontWeight={600} gutterBottom>
                    Thông tin học bổng
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Lý do xin học bổng
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          {mockSubmissionDetail.scholarship.reason}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Thành tích nổi bật
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          {mockSubmissionDetail.scholarship.achievements}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Số tiền học bổng mong muốn
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          {mockSubmissionDetail.scholarship.targetAmount}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Box>

                <Box>
                  <Typography variant="body1" color="primary" fontWeight={600} gutterBottom>
                    Tài liệu đính kèm
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
                    <Grid container spacing={2}>
                      {mockSubmissionDetail.documents.map((doc, index) => (
                        <Grid item xs={12} sm={4} key={index}>
                          <Button 
                            variant="outlined" 
                            fullWidth
                            href={doc.url}
                            sx={{ 
                              justifyContent: 'flex-start', 
                              textTransform: 'none',
                              py: 1
                            }}
                          >
                            {doc.name}
                          </Button>
                        </Grid>
                      ))}
                    </Grid>
                  </Paper>
                </Box>
              </Box>
            )}
          </DialogContent>
          <Divider />
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={handleCloseDetail} variant="outlined" sx={{ borderRadius: 1 }}>
              Đóng
            </Button>
            {currentSubmission && currentSubmission.status === 'pending' && (
              <>
                <Button 
                  onClick={() => {
                    handleReject(currentSubmission.id);
                    handleCloseDetail();
                  }} 
                  variant="outlined" 
                  color="error"
                  sx={{ borderRadius: 1 }}
                >
                  Từ chối
                </Button>
                <Button 
                  onClick={() => {
                    handleApprove(currentSubmission.id);
                    handleCloseDetail();
                  }} 
                  variant="contained" 
                  color="primary"
                  sx={{ borderRadius: 1 }}
                >
                  Phê duyệt
                </Button>
              </>
            )}
          </DialogActions>
        </Dialog>
      </Container>
    </Fade>
  );
};

export default FormReview; 